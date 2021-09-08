
const { program } = require("commander")
const { promisify } = require("util") // node自带的提供异步方法
const shell = require("shelljs")
const fs = require("fs")
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");  // 需要安装6.0.0以下的版本，6.0.0支持了es module，require导入会报错, 
const symbols = require("log-symbols"); // 同理需要安装5.0.0以下版本
const dowm = require("download-git-repo");
const figlet = promisify(require('figlet'));

const gitUrl = "https://github.com/helloworldhzx/manger-front.git"
const branch = "main"

// 第二个参数修改选项
program.version(require("../package.json").version, "-v -Version", "output the version number")

// option-------配置选项
// program.option("-v -version", "output the version number") 这样修改不生效，只会添加一个选项

// Command--------命令
program.command("zz-cli <app-name>")
  .option('-d, --dev <version>', '获取开发版')
  // .argument('[password]', 'password for user, if required', 'no password given')
  .description('安装脚手架')  //                                  ↑ 这里添加
  .action(async (name, options, command) => {  // action里接受的参数可以在.argument中添加
    console.log(name, options)
    const res = await figlet.textSync("zz-cli", {
      font: "Alpha"
    }) // 输出大写字体  配置效果地址http://patorjk.com/software/taag/
    console.log(res)

    // 判断git命令行是否可运行
    if (!shell.which("git")) {
      console.log(symbols.error, "命令行不可用")
      return;
    }
    // 判断项目是否已存在
    if (fs.existsSync(name)) {
      console.log(symbols.error, "项目已存在！！！！！");
      return;
    }
    // 判断项目名是否合法
    if (name.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
      console.log(symbols.error, "项目名称存在非法字符！");
      return;
    }
    inquirer.prompt([{
      type: "input",
      message: "请输入你的姓名",
      name: "name"
    }, {
      type: "list",
      message: "请选着你要下载的模板",
      choices: ["javaScript", "typeScript"],
      name: "js"
    }, {
      type: "checkbox",
      message: "请选着你要使用的css扩展",
      choices: ["less", "sass"],
      name: "css"
    }]).then(async answers => {
      console.log(chalk.green("你选了也没有用, 我就只有一个模板, 我只是练习下prompt的配置"))
      const spinner = ora("开始下载模板....").start(); // loaing效果
      dowm(`direct:${gitUrl}#${branch}`, name, { clone: true }, function (err) {
        console.log(err)
        spinner.succeed("下载成功!!!!")  // 是succeed不是success,这问题找了半天
        console.log(`执行以下步骤启动项目
        cd ${name}
        yarn add
        npm run dev
        `);
      })
    }).catch(err => {
      console.log(err)
    })

  })



/* program
  .argument('<name>')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, options, command) => {
    console.log(name, options, command)
    if (options.debug) {
      console.error('Called %s with options %o', command.name(), options);
    }
    const title = options.title ? `${options.title} ` : '';
    console.log(`Thank-you ${title}${name}`);
  }); */



program.parse(process.argv)