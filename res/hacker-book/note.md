- mysql

      CREATE TEMPORARY TABLE chan2 ENGINE=MEMORY SELECT * FROM channel WHERE chanid=21051;
      UPDATE chan2 SET chanid=21109; // Change the unique key
      // Update anything else that needs to be updated.
      INSERT INTO channel SELECT * FROM chan2;
      DROP TABLE chan2;

- git

      git reset <file>
      git diff --staged
      git checkout 0d1d7fc32 // # This will detach your HEAD, that is, leave you with no branch checked out

- ubuntu

      open filename // open image or other file

- android sdk

      tar -xvf android-sdk_r24.2-linux.tgz
      cd android-sdk-linux/tools

- install all sdk packages

      ./android update sdk --no-ui
      export ANDROID_HOME=$HOME/src/android-sdk-linux
      export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

- Applications not resizing with WM, menus immediately closing

      export _JAVA_AWT_WM_NONREPARENTING=1

- open test.xlsx

- vim格式化，选中后敲入=

- webstorm  auto format code

      Ctrl + Alt + L

- configure a service to run at startup

1. Open /etc/rc.local file with this command:

       vim /etc/rc.local

2. Add your script that you want to run on boot process there, for example:

       # 开启代理  
       /home/jemo/src/proxy/shadowsocks/shadowsocks-local-linux64-1.1.5

3. Review the comments included in that file and make sure an exit 0 is at the end.
4. Save the files. And your script will run on boot process.

- How to create alias in Fish  

      vi ~/.config/fish/config.fish  
      alias ll="ls --human-readable -l"
      alias xmind='cd ~/src/xmind-8-update7-linux/XMind_amd64; and ./XMind &'

