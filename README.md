###扇贝任务 GuardianReader
一个chrome插件，将英国卫报的网页改造成类似于扇贝新闻的那种。

实现功能：
- 利用扇贝api 查词
- 点击单词自动发音
- 过滤除正文和图片之外的部分（适用于the Guardian几乎所有新闻页面）
- 图片大小自适应
- 前端分页
 
关于前端分页：
 这个效果实现的不是特别好，想了一周时间，试了多种方案，仍然没能完美实现。尝试的方案有：
 1. 使用CSS3新属性```-webkit-column-*```，即先用JS设置内容的```-webkit-column-width```，再使用JS获取```-webkit-column-count```（分栏列数），再结合```element.scrollLeft```实现分页，然而后来发现设置了```-webkit-column-width```后，```-webkit-column-count```的值并不能用JS取得（仍为空）。
 2. 将内容高度设置为内容行高的整数倍，然后用```element.scrollTop```实现分页。后来发现由于自适应图片的存在，难以确定内容高度。
 3. 使用正则表达式获取行数。无法实现。 

......等等

