<?php
$page = 'ui';
if (!empty($_GET['page']) && $_GET['page'] != $page) {
  $page = $_GET['page'];
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <link rel="apple-touch-icon-precomposed" href="images/favicons/apple-touch-icon-152x152.png">
    <link rel="icon" href="images/favicons/favicon-96x96.png">
    <!--[if IE]><link rel="shortcut icon" href="images/favicons/favicon-32x32.ico"><![endif]-->
    <meta name="msapplication-TileColor" content="#775680">
    <meta name="msapplication-TileImage" content="images/favicons/mstile-144x144.png">

  <title>MyDocTool</title>

  <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
  <link href="css/styles.css?time=<?php echo time();?>" rel="stylesheet">

  <script src="js/modernizr.custom.min.js"></script>
  <script src="js/jquery.min.js"></script>
  <script src="js/bootstrap.min.js"></script>

  <script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"></script>

  <script src="js/main.js"></script>

</head>

<body>

<div id="popover-model" class="hidden">
    <button type="button" class="close">x</button>
    <p>fdfdfd</p>
</div>
<!-- <div id="blank"></div> -->

<!-- HEADER -->
<nav id="header" class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a href="index.php" class="logo">
        <img src="images/SVG/logo.svg" />
      </a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul id="menu" class="nav navbar-nav navbar-center">
        <li <?php if($page=='dashboard'){echo ' class="active" ';}?>><a href="index.php?page=dashboard">Dashboard</a></li>
        <li <?php if($page=='patients'){echo ' class="active" ';}?>><a href="index.php?page=patients">Mes patients</a></li>
        <li <?php if($page=='protocoles'){echo ' class="active" ';}?>><a href="index.php?page=protocoles">Mes pr</a></li>
        <li><a href="index.php?page=">Ajouter un patient</a></li>
      </ul>
      <ul id="profilMenu" class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="profile dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <div>
              <!-- <img src="https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xft1/t51.2885-15/e35/11419219_945704702159708_793436856_n.jpg" class="img-circle" /> -->
              AD
            </div>
            <p>Aurélien DIGOUT</p>
          </a>
          <ul class="dropdown-menu">
            <li><span class="icon-user"></span><a href="flux.php?page=user_infos">Mes informations</a></li>
            <li><span class="icon-house"></span><a href="flux.php?page=user_address">Mon adresse</a></li>
            <li><span class="icon-locked"></span><a href="flux.php?page=user_password">Mot de passe</a></li>
            <li><span class="icon-logout"></span><a href="#">Déconnexion</a></li>
          </ul>
        </li>
        <li class="brand">
          <img src="http://etablissements.hopital.fr/pics/photos/structures_photo_logo_3234.jpg">
        </li>
      </ul>
    </div>

  </div>
</nav>
<!-- FIN HEADER -->


<!-- Includes des pages index.php?page= -->
<?php include 'pages/'.$page.'.html'; ?>
<!-- FIN Includes -->


</body>

</html>
