let temp = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
body {
  font-family: "Open Sans", sans-serif;
  color: #444444;
  background-color: #191919;
  margin:0;
  -webkit-text-size-adjust:100%;
  -webkit-tap-highlight-color:transparent;
}

a {
  color: pink;
  text-decoration: none;
}

a:hover {
  color: rgb(255, 146, 164);
  text-decoration: none;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Raleway", sans-serif;
}
/*--------------------------------------------------------------
# Header
--------------------------------------------------------------*/
#header {
  background: #191919;
  transition: all 0.5s;
  z-index: 997;
  padding: 20px 0;
}
#header.header-scrolled {
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
}
#header .logo {
  font-size: 32px;
  margin: 0;
  padding: 0;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.5px;
}
#header .logo a {
  color: rgb(213, 213, 213);
  font-size: xx-large;
}
@media (max-width: 991px) {
  #header {
    padding: 12px 0;
  }
}
.navbar a, .navbar a:focus {
  display: flex;
  align-items: center;
  justify-content:center;
  font-family: "Raleway", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #6a7489;
}
</style>
</head>
<nav class="navbar" style="background-color: #191919; text-decoration: none;" role="navigation" aria-label="main navigation">
        <div class="container">
                <header id="header" class="fixed-top">
                    <div class="container d-flex align-items-center justify-content-between">
                      <h1 class="logo"><a href="/">아람이</a></h1>              
                    </div>
                </header>
            </div>
        </div>
    </nav>
<body style="background-color: #3a3a3a;color:white;
align-items: center;
justify-content: center;
text-align: center;">
<br><br>
    <h2 style="color:pink;">5분 안에 아래 인증키를 입력하세요</h2>
    <h1>$$$key$$$</h1>
    <br><br>
    <small style="color: pink; font-weight: bolder;">이 키는 절대 외부에 유출해선 안됩니다<br>만약 본인이 요청한게 아니라면 이 메일을 무시하세요</small>
    <br><br>
    <small style="color: pink; font-weight: bolder;"><a href="mailto:juan@laon.dev">메일로 문의하기</a></small>
</body>
</html>`
module.exports.value = temp;