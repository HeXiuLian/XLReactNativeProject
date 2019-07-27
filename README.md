# XLReactNativeProject
RN项目，通用组件。

### 1. XLScrollView

![banner](https://github.com/HeXiuLian/XLReactNativeProject/blob/master/README_Source/banner.gif)


API：

```
showIndex: number,显示的索引,默认0

autoScroll: Bool,自动滚动,默认false

duration: number,滚动的时间间距,默认2000毫秒

loopState:Bool,是否循环滚动，默认false

showPageControl: Bool,是否显示页码，默认false

style: ViewPropTypes.Style,广告视图的样式，StyleSheet创建

defaultSource: 默认显示图片，require(图片路径)

resizeMode: string,图片显示模式,默认："cover"

imageStyle: ViewPropTypes.Style,图片的样式，StyleSheet创建

failImagePath: 失败显示的图片，require(图片路径)

imageUrlArray: Array,//http的图片数组

imagePathArray: Array,//本地图片的地址（优先)

tapImageAction: function,//图片单击回调

onMomentumScrollEnd: function,//图片滚动结束回调

renderPageComponent: function,//绘制页码显示组件

renderLoadingComponent: function,//绘制加载显示组件

renderImageDescComponent: function,//绘制图片显示组件

currentPagePointerStyle: ViewPropTypes.Style,//当前显示页码的样式,StyleSheet创建

otherPagePointerStyle: ViewPropTypes.Style,//其他页码的样式,StyleSheet创建

```

### 2、XLCategoryList：菜单分类列表

![菜单](https://github.com/HeXiuLian/XLReactNativeProject/blob/master/README_Source/menuList.gif)

使用：

```
 <XLCategoryList
        style={styles.listbox}
        leftList={AppData.leftList}
        rightList={AppData.rightList}
        addButtonClick={(item, index, section) => {

        }}
        sectionItemClick={(item, index, section) => {

        }}
        scrollEnd={(hasScrollEnd) => {
            if (hasScrollEnd) {
                if (this.state.currentInTop) {
                    this.refs.baseScrollView.scrollToEnd();
                    this.state.currentInTop = false;
                }
            } else {
                if (!this.state.currentInTop) {
                    this.refs.baseScrollView.scrollTo({ y: 0, animated: true });
                    this.state.currentInTop = true;
                }
            }
        }}
/>

```
属性说明：

```
style: null, ///列表大小style
leftList: [],//左侧分类列表数组
rightList: [],//右侧分类列表
sectionItemClick: null,//点击右侧分组的item回调
addButtonClick: null,//点击加号按钮回调
scrollEnd: null,//右侧分类列表开始滚动离开顶部和回到顶部回调
```



