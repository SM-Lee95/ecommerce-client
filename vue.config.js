const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "/Users/iseongmu/IdeaProjects/PlumRepo/src/main/resources/static"),
  indexPath: path.resolve(__dirname, "/Users/iseongmu/IdeaProjects/PlumRepo/src/main/resources/static/index.html"),

  //  outputDir: path.resolve(__dirname, "/Users/iseongmu/IdeaProjects/cloudtype_Lovane/src/main/resources/static"),
  //  indexPath: path.resolve(__dirname, "/Users/iseongmu/IdeaProjects/cloudtype_Lovane/src/main/resources/static/index.html"),
  transpileDependencies: ["vuetify"],
}