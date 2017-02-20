'use strict';

import React, {Component, PropTypes} from 'react';
import {Line} from 'react-chartjs';
import dateFormat from 'dateformat-light';
import isodate from "isodate";
import _ from 'lodash';
import AlertStore from '../../../stores/alertStore';
import {ITEM, CHART, UNIT} from '../../../constants/parameters';
import utils from '../../../services/utils';

const defaultOptions = {
  showTooltips: false,
  responsive: true,
  maintainAspectRatio: false,
  tooltipFontSize: 14,
  showScale: false,
  ///Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines : false,
  //String - Colour of the grid lines
  scaleGridLineColor : "rgba(0,0,0,.05)",
  //Number - Width of the grid lines
  scaleGridLineWidth : 1,
  //Boolean - Whether to show horizontal lines (except X axis)
  scaleShowHorizontalLines: false,
  //Boolean - Whether to show vertical lines (except Y axis)
  scaleShowVerticalLines: false,
  //Boolean - Whether the line is curved between points
  bezierCurve : false,
  //Number - Tension of the bezier curve between points
  bezierCurveTension : 0.4,
  //Boolean - Whether to show a dot for each point
  pointDot : true,
  //Number - Radius of each point dot in pixels
  pointDotRadius : 6,
  //Number - Pixel width of point dot stroke
  pointDotStrokeWidth : 2,
  //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
  pointHitDetectionRadius : 5,
  //Boolean - Whether to show a stroke for datasets
  datasetStroke : true,
  //Number - Pixel width of dataset stroke
  datasetStrokeWidth : 2,
  //Boolean - Whether to fill the dataset with a colour
  datasetFill : false,
};

const propTypes = {
  item: PropTypes.object.isRequired,
  itemActivities: PropTypes.array.isRequired,
  showTooltips: PropTypes.bool,
  maxDataPoints: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  activitiesRange: PropTypes.number
};

const defaultProps = {
  maxDataPoints: 7,
  showTooltips: false,
};

class ItemActivitiesChart extends Component {

  constructor(props) {
    super(props);

    const chartOptions = _.assign(defaultOptions, {
      showTooltips: this.props.showTooltips,
      tooltipTemplate: "<%if (label){%><%=label%>\r\n<%}%><%= value %>",
      tooltipFillColor: "#F1F1F1",
      tooltipFontColor: "#909090",
    });

    this.state = _.assign({
      data: [],
      labels: [],
      alerts: [],
      chart: null,
      chartOptions: chartOptions,
    }, this.setChartData(this.props));
  }

  componentDidMount() {
    if (this.refs.myChart) {
      this.setState({chart: this.refs.myChart.getChart()});
      this.setChartAlerts();
    }
  }

  setChartData = (props) => {
    let {item, itemActivities} = props;

    let data = [];
    let labels = [];
    let alerts = [];

    if (props.activitiesRange && props.activitiesRange !== null) {
      let startDate = new Date();

      // case for 2 weeks.
      switch (props.activitiesRange) {
        case CHART.TWO_WEEKS:
          startDate = utils.addTimeIntervalToDate(new Date(), -14, UNIT.DAY);
          break;

        case CHART.ONE_MONTH:
          startDate = utils.addTimeIntervalToDate(new Date(), -1, UNIT.MONTH);
          break;

        case CHART.THREE_MONTHS:
          startDate = utils.addTimeIntervalToDate(new Date(), -3, UNIT.MONTH);
          break;

        case CHART.SIX_MONTHS:
          startDate = utils.addTimeIntervalToDate(new Date(), -6, UNIT.MONTH);
          break;

        case CHART.ONE_YEAR:
          startDate = utils.addTimeIntervalToDate(new Date(), -12, UNIT.MONTH);
          break;
      }

      var i = itemActivities.length - 1;
      if (i >= 0) {
        while (i >= 0 && isodate(itemActivities[i].created_at) > startDate) {
          let answer = '';
          if (item.question_type === ITEM.QUESTION_BOOL) {
            answer = itemActivities[i].answer ? 1 : 0;
          } else {
            answer = itemActivities[i].answer;
          }
          data.unshift(answer);
          labels.unshift(dateFormat(isodate(itemActivities[i].created_at), 'dd/mm'));

          let alert = AlertStore.findByItemActivitySlug(itemActivities[i].slug);
          alerts.unshift(alert);
          i--;
        }
      }
    }

    else {

      for (var i = itemActivities.length - 1;
        i > Math.max(itemActivities.length - 1 - this.props.maxDataPoints, 0);
        i--
      ) {
        data.unshift(itemActivities[i].answer);
        labels.unshift(dateFormat(isodate(itemActivities[i].created_at), 'dd/mm'));

        let alert = AlertStore.findByItemActivitySlug(itemActivities[i].slug);
        alerts.unshift(alert);
      };
    }

    return {
      labels: labels,
      data: data,
      alerts: alerts,
    };
  }

  setChartAlerts = () => {
    if (this.refs.myChart) {
      let chart = this.refs.myChart.getChart();

      if (chart !== null) {
        this.state.alerts.forEach((alert, i) => {
          if (alert && alert !== undefined && alert !== null) {
            if (chart.datasets[0].points[i]) {
              chart.datasets[0].points[i].fillColor = "#D9455F";
            }
          }
        });
        chart.update();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.setChartData(nextProps));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.activitiesRange !== this.props.activitiesRange;
  }

  componentDidUpdate(prevProps, prevState) {
    this.setChartAlerts();
  }

  render() {
    const chartData = {
      labels: this.state.labels,
      datasets: [{
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: '#B8E986',
        pointStrokeColor: "#fff",
        pointHighlightFill: "#EAAA00",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: this.state.data
      }]
    };

    const divStyle = {
      height: this.props.height,
      width: '100%',
    };

    return (
      <div style={divStyle}>

        {this.state.data.length === 0 ? (
          <div style={{marginTop: 30}}>
            Aucune donnée sur cette période
          </div>
        ): ''}
        <Line className="chart"
          data={chartData}
          options={this.state.chartOptions}
          ref="myChart"
          redraw
        />
      </div>
    );
  }
}

ItemActivitiesChart.propTypes = propTypes;
ItemActivitiesChart.defaultProps = defaultProps;

export default ItemActivitiesChart;
