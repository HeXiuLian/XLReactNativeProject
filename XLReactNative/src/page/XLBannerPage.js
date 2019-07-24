/* eslint-disable react/no-string-refs */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import React, { Component } from "react";

import {
    StyleSheet,
    Dimensions,
    Platform,
    View,
    Text,
} from "react-native";
import XLScrollView from '../component/XLScrollView';

const { width, height } = Dimensions.get("window");
const navigationBarHeight = Platform.OS === "ios" ? (height >= 812.0 ? 88 : 64) : 44;

export default class XLBannerPage extends Component {
    static navigationOptions = {
        title: "广告视图"
    };
    constructor(props) {
        super(props);
        this.state = {
            data: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563798244412&di=0ef4ea38c2d501eade1adf90f7a61694&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20170220%2F3bde98f642f546be95b2d242994897aa_th.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563798244412&di=ab5ffed46d879fe55661675fe37258b1&imgtype=0&src=http%3A%2F%2Fpic.rmb.bdstatic.com%2Ff54083119edfb83c4cfe9ce2eeebc076.jpeg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563798244410&di=2f4377196842f289eafe710e866d405c&imgtype=0&src=http%3A%2F%2Ffile102.mafengwo.net%2Fs5%2FM00%2F7B%2F21%2FwKgB3FHwynKAT3HcAA_Gi-NQAns71.jpeg'],
            textArray: ['云南的花海是每个季节都不一样的，但是有一点是相同的，那就是一样的美。', '江南的小桥流水很是惬意。', '西北总是能在湖面上见到蓝蓝的天。']

        };
    }

    componentWillUnmount() {
        this.refs.adPage.stopTimer();
    }

    render() {
        return (
            <View style={styles.containter}>
                <XLScrollView
                    ref={"adPage"}
                    style={styles.bannerBox}
                    imageStyle={styles.bannerBox}
                    loopState={true}
                    showPageControl={true}
                    autoScroll={true}
                    imageUrlArray={this.state.data}
                    renderLoadingComponent={() => {
                        return <Text>加载中...</Text>;
                    }}
                    renderImageDescComponent={(index) => {
                        return <View style={styles.textBg}>
                            <Text style={styles.textStyle}>{this.state.textArray[index]}</Text>
                        </View>;
                    }}
                    tapImageAction={(index) => {
                        console.log(index);
                    }}
                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    containter: {
        width: width,
        height: height - navigationBarHeight
    },
    bannerBox: {
        width: width,
        height: 200
    },
    textBg: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    textStyle: {
        width: 375,
        lineHeight: 24,
        color: '#fff',
        paddingHorizontal: 10,
        fontSize: 14
    }
});
