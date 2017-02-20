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
  <link href="css/login.css" rel="stylesheet">

  <script src="js/modernizr.custom.min.js"></script>
  <script src="js/jquery.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/bootstrap-rating.min.js"></script>

</head>

<body>

<div id="login" class="container">
  <div class="col-md-6">
    <div class="infos">
      <div class="logo">
      <p>
        <img src="http://etablissements.hopital.fr/pics/photos/structures_photo_logo_3234.jpg">
      </p>
      </div>
      <h2>Bonjour,</h2>
      <p class="message">pour recevoir les informations de votre médecin et répondre à ses questions, merci de vous connecter</p>
    </div>
  </div>
  <div class="col-md-6">
    <div class="form">
      <h2>Connectez-vous</h2>
      <form class="form-horizontal">
        <div class="form-group">
          <div class="col-sm-12">
            <input type="text" class="form-control" id="mail" placeholder="Votre adresse email">
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-12">
            <input type="password" class="form-control" id="pw" placeholder="Votre mot de passe">
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <div class="checkbox autoLog">
              <input type="checkbox" id="autoLog">
              <label for="autoLog">Se rappeller de moi</label>
            </div>
          </div>
          <div class="col-sm-6 text-right">
            <a class="forgotten" href="forgotten_password.php">Mot de passe oublié ?</a>
          </div>
        </div>
      </form>
      <a href="#" class="btn">Connexion</a>
    </div>
  </div>
  <div class="text-center col-md-6 col-md-offset-6 actions">
    <p>Vous n'êtes pas inscrit ? <a href="register.php">Créez un compte</a></p>
  </div>
  <div id="footer">
    <a href="#"><img src="images/SVG/powered.svg"></a>
  </div>
</div>


</body>

</html>

