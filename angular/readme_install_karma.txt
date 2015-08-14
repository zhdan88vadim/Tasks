Install studio for web express 2012 
 
Install git 
 
Install node js 
 
Install bower 
 
Install pyton 2.7 
 
Install visual studio for windows express 2012 
 
 
I had the same issue with other modules after installing VS Express 2013 for web alongside VS Express 2012 for Windows. 
The solution was to install VS 2013 for Windows and use the switch 
npm install --msvs_version=2013 
 
http://gotoanswer.com/?q=npm+install+-g+karma+error+MSB4019%3A+The+imported+project+%E2%80%9CC%3A%5CMicrosoft.Cpp.Default.props%E2%80%9D+was+not+found 
 
 
 
npm install karma --msvs_version=2013  or npm install karma --msvs_version=2012 
 
-- ¬ыполнить эти команды перед запуском тестов кармы. -- 
 
npm install karma-chrome-launcher --save-dev 
npm install karma-firefox-launcher --save-dev 
npm install karma-jasmine --save-dev 
 
 
ƒл€ того, чтобы karma была доступна из командной строки. 
 
npm install -g karma-cli 
 
 
-- «апуск скрипта теста -- 
 
karma start karma.conf.js 
 
 
=============================== 
 
Chrome после старта теста не запускаетс€. 
 
”становка полной версии, а не портативной решила проблему. 
 
 
 
