/* eslint-disable no-dupe-class-members */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-string-refs */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from "react-native";

const window = Dimensions.get("window");
var timer = null;
var timer1 = null;
var timer2 = null;

export default class XLScrollView extends Component {
    firstInit = true;

    static defaultProps = {
        showIndex: 0,///显示的索引
        autoScroll: false,//自动滚动
        duration: 2000,//滚动的时间间距:2s
        loopState: false,//是否循环滚动
        showPageControl: false,//是否显示页码
        style: null,//外部视图的样式
        defaultSource: require("../source/image/failImage.png"),///默认显示图片
        resizeMode: "cover",///图片显示模式
        imageStyle: { width: window.width, height: 120 },//图片的样式
        failImagePath: require("../source/image/failImage.png"),//失败显示的图片require
        imageUrlArray: null,//http的图片数组
        imagePathArray: null,//本地图片的地址
        tapImageAction: null,//图片单击回调
        onMomentumScrollEnd: null,//图片滚动结束回调
        renderPageComponent: null,//绘制页码显示组件
        renderLoadingComponent: null,//绘制加载显示组件
        renderImageDescComponent: null,//绘制图片显示组件
        currentPagePointerStyle: null,//当前显示页码的样式
        otherPagePointerStyle: null,//其他页码的样式
    }

    /*组件将要被移除方法*/
    componnetWillUnmount() {
        this.stopTimer();
    }

    //组件加载完成
    componentDidMount() {
        this.props.autoScroll && this.state.count > 1 && this.startTimer();
    }
    //停止定时器
    stopTimer() {
        clearInterval(timer);
        timer = null;
        clearTimeout(timer1);
        timer1 = null;
        clearTimeout(timer2);
        timer2 = null;
    }
    // 开启定时器
    startTimer() {
        if (!this.refs.scrollView) {
            return;
        }
        this.stopTimer();
        timer = setInterval(() => {
            console.log(123);
            this.scrollToPage(this.state.currentPage + 1, true);
        }, this.props.duration);
    }

    constructor(props) {
        super(props);
        let imageArray = props.imagePathArray ? props.imagePathArray : props.imageUrlArray;
        let count = imageArray.length;
        if (count > 1 && this.props.loopState) {
            count = count + 2;
        }
        let showIndex = this.props.loopState ? (count > 1 ? props.showIndex + 1 : props.showIndex) : props.showIndex + 1;

        this.state = {
            errorIndex: [],
            loadFinishIndex: [],
            currentPage: showIndex,
            imageArray: imageArray,
            count: count,
        };
    }

    render() {
        return (
            <View style={this.props.style}>
                <ScrollView style={[this.props.style]}
                    ref="scrollView"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    // 开始拖拽
                    onScrollBeginDrag={this.onScrollBeginDrag.bind(this)}
                    // 停止拖拽
                    onScrollEndDrag={this.onScrollEndDrag.bind(this)}
                    onMomentumScrollEnd={(e) => this.onAnimationEnd(e)}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        if (this.firstInit) {
                            this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (this.state.currentPage), animated: false });
                            this.firstInit = false;
                        }
                    }}
                >
                    {
                        this.renderImage()
                    }
                </ScrollView>
                {
                    this.props.showPageControl ? this.renderPageControl() : null
                }
            </View>
        );
    }

    renderPageControl() {
        if (this.props.renderPageComponent) {
            return this.props.renderPageComponent();
        }
        return <View style={{ position: "absolute", bottom: 10, left: 0, width: this.props.style.width }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                {
                    this.renderPagePointer()
                }
            </View>
        </View>;
    }

    renderPagePointer() {
        let arrPointer = [];
        for (let index = 0; index < this.state.imageArray.length; index++) {
            let currentPage = this.props.loopState && this.state.imageArray.length > 1 ? this.state.currentPage - 1 : this.state.currentPage;

            let pointerStyle = currentPage === index ? this.props.currentPagePointerStyle : this.props.otherPagePointerStyle;

            if (!pointerStyle) {
                pointerStyle = currentPage === index ? styles.currentPagePointer : styles.otherPagePointer;
            }
            arrPointer.push(<View key={"pointer" + index} style={pointerStyle} />);
        }
        return arrPointer;
    }

    renderImage() {
        let arrComp = [];
        let imageArray = this.state.imageArray;

        for (let index = 0; index < this.state.count; index++) {
            let element;
            let idx = 0;
            if (index === 0) {
                idx = this.state.count > 3 ? this.state.count - 3 : 0;
                element = imageArray[idx];
            } else {
                idx = this.props.loopState ? (index - 1) % (this.state.count - 2) : index;
                element = imageArray[idx];
            }
            arrComp.push(<TouchableOpacity
                style={{ width: this.props.imageStyle.width, height: this.props.imageStyle.height, justifyContent: "center" }}
                key={"image" + index}
                activeOpacity={1}
                onPress={() => {
                    this.props.tapImageAction && this.props.tapImageAction(idx);
                }}
            >
                <Image
                    style={{ flex: 1, backgroundColor: "#f7f7f7" }}
                    source={this.getLoadFailStatus(index) ? this.props.failImagePath : { uri: element }}
                    defaultSource={{ number: this.props.defaultSource }}
                    onLoadEnd={(e) => {
                        let loadFinishIndex = this.state.loadFinishIndex;
                        loadFinishIndex.push(index);
                        this.setState({
                            loadFinishIndex: loadFinishIndex,
                        });
                    }}
                    onError={() => {
                        let errorIndex = this.state.errorIndex;
                        errorIndex.push(index);
                        this.setState({
                            errorIndex: errorIndex,
                        });
                    }}
                />
                <View style={{ position: "absolute", width: this.props.imageStyle.width, height: this.props.imageStyle.height, left: 0, top: 0, alignItems: "center" }}>
                    {
                        this.renderLoadingComponent && this.getLoadFinishStatus(index) ? this.props.renderLoadingComponent(idx) : null
                    }
                    {
                        this.props.renderImageDescComponent ? this.props.renderImageDescComponent(idx) : null
                    }
                </View>
            </TouchableOpacity>);
        }
        return arrComp;
    }

    getLoadFinishStatus(index) {
        let status = false;//未完成
        for (let item of this.state.loadFinishIndex) {
            if (item === index) {
                status = true;
                break;
            }
        }
        return status;
    }

    getLoadFailStatus(index) {
        let status = false;//未完成
        for (let item of this.state.errorIndex) {
            if (item === index) {
                status = true;
                break;
            }
        }
        return status;
    }
    //  当一帧滚动结束的时候调用
    onAnimationEnd(e) {
        // 1.求出水平方向的偏移量
        var offSetX = e.nativeEvent.contentOffset.x;
        // 2.求出当前的页数
        var currentPage = Math.floor((offSetX + 10) / this.props.style.width);
        this.scrollToPage(currentPage, false);
    }
    /*定时器操作*/
    /* 调用开始拖拽 */
    onScrollBeginDrag() {
        console.log("begin");
        if (this.props.autoScroll && this.state.count > 1) {
            // 停止定时器
            this.stopTimer();
            this.props.onScrollBeginDrag && this.props.onScrollBeginDrag();
        }
    }

    /*调用停止拖拽*/
    onScrollEndDrag() {
        console.log("end");
        if (this.props.autoScroll && this.state.count > 1) {
            // 开启定时器
            this.startTimer();
        }
    }
    /**
     * 滚动至哪一页
     * @param {页码} currentPage 
     * @param {是否自动*} auto 
     */
    scrollToPage(currentPage, auto) {
        if (this.props.loopState) {
            //向右最大页，需重置到第一页
            if (currentPage >= this.state.count - 1) {
                if (auto) {
                    // this.refs.scrollView &&
                    this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: auto });
                    //动画连贯处理
                    timer1 = setTimeout(() => {
                        currentPage = 1;
                        // this.refs.scrollView &&
                        this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: false });
                    }, 500);
                } else {
                    currentPage = 1;
                    this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: false });
                }

            } else if (currentPage < 1) {
                //向左到最小页，需重置到倒数第二页
                if (auto) {
                    // this.refs.scrollView && 
                    this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: auto });
                    //动画连贯处理
                    timer2 = setTimeout(() => {
                        currentPage = this.state.count - 2;
                        // this.refs.scrollView && 
                        this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: false });
                    }, 500);
                } else {
                    currentPage = this.state.count - 2;
                    // this.refs.scrollView && 
                    this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: false });
                }

            } else {
                if (auto) {
                    // this.refs.scrollView && 
                    this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: auto });
                }
            }
        } else {
            if (auto) {
                // this.refs.scrollView && 
                this.refs.scrollView.scrollTo({ x: this.props.imageStyle.width * (currentPage), animated: auto });
            }
        }
        this.setState({
            currentPage: currentPage,
        });
    }
}

const styles = StyleSheet.create({
    currentPagePointer: {
        width: 10,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
        backgroundColor: "#C9CBD2"
    },
    otherPagePointer: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
        backgroundColor: "#E0E1E6"
    }
})
