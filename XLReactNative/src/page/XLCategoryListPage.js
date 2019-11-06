/* eslint-disable curly */
/* eslint-disable eol-last */
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
    Dimensions,
    StyleSheet,
    Platform
} from "react-native";
import XLCategoryList from '../component/XLCategoryList';
import XLScrollView from '../component/XLScrollView';
import AppData from '../source/json/AppData';

const window = Dimensions.get("window");
const bottom = Platform.OS === "ios" ? (window.height >= 812.0 ? 34 : 0) : 0;
const navigationHeight = Platform.OS === "ios" ? (window.height >= 812.0 ? 88 : 64) : 44;

export default class XLCategoryListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageUrlArray: AppData.bannerList,
            currentInTop: true,
        };
    }
    componentWillUnmount() {
        this.refs.banber.stopTimer();
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref={'baseScrollView'}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnable={false}
                    onScroll={(e) => this.onMomentumScrollEnd(e)}
                >
                    <View>
                        <XLScrollView
                            ref={"banber"}
                            style={styles.bannerBox}
                            imageStyle={styles.bannerBox}
                            showPageControl={true}
                            loopState={true}
                            autoScroll={true}
                            imageUrlArray={this.state.imageUrlArray}
                        />
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
                    </View>
                </ScrollView>
            </View>
        );
    }

    onMomentumScrollEnd(e) {
        var offSetY = e.nativeEvent.contentOffset.y;
        if (offSetY <= 0) {
            this.setState({
                needScrollToEnd: true,
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: bottom
    },
    bannerBox: {
        height: 80,
        width: window.width
    },
    listbox: {
        width: window.width,
        height: window.height - bottom - navigationHeight,
        flexDirection: 'row',
        backgroundColor: '#fff'

    }
});