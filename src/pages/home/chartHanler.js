import echarts from "echarts"

export function makePieOption(item) {
    return {
        title: [{
            text: `${item.paid}元`,
            left: '25%',
            textAlign: 'center',
            top:'30%',
            padding:[24,0],
            textStyle:{
                color:'#ff5b02',
                fontSize: 24,
                align:'center',
                fontWeight: 500
            }
        }, {
            text: '已付',
            left: '25%',
            textAlign: 'center',
            top:'42%',
            padding:[24,0],
            textStyle:{
                color:'#bcbcbc',
                fontSize: 12,
                align:'center',
                fontWeight: 400
            }
        }, {
            text: item.date,
            left: '25%',
            textAlign: 'center',
            top:'50%',
            padding:[24,0],
            textStyle:{
                color:'#333',
                fontSize: 16,
                align:'center',
                fontWeight: 400
            }
        }, {
            text: `${item.payable}元`,
            left: '75%',
            textAlign: 'center',
            top:'30%',
            padding:[24,0],
            textStyle:{
                color:'#ff5b02',
                fontSize: 24,
                align:'center',
                fontWeight: 500
            }
        }, {
            text:'已付',
            left: '75%',
            textAlign: 'center',
            top:'42%',
            padding:[24,0],
            textStyle:{
                color:'#bcbcbc',
                fontSize: 12,
                align:'center',
                fontWeight: 400
            }
        }, {
            text: item.date,
            left: '75%',
            textAlign: 'center',
            top: '50%',
            padding: [24,0],
            textStyle:{
                color:'#333',
                fontSize: 16,
                align:'center',
                fontWeight: 400
            }
        }],
        series: [{
            type: 'pie',
            radius: ['60%', '70%'],
            center: ['25%', '50%'],
            color: ['#ff5b02', '#bcbcbc'],
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [item.paid, item.total - item.paid]
        },{
            type: 'pie',
            radius: ['60%', '70%'],
            center: ['75%', '50%'],
            color: ['#ff5b02', '#bcbcbc'],
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [item.payable, item.total - item.payable]
        }]
    }
}

export function makeLineOption(data) {
    const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
    return {
        legend: {
            icon: 'circle',
            top: 10,
            right: 'center',
            itemWidth: 6,
            itemGap: 20,
            textStyle: {
                color: '#556677'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: 26,
            right: 14,
            bottom: 46,
            left: 50
        },
        xAxis: [{
            type: 'category',
            data: data.map(it => it.date.substring(5)),
            axisLine: {
                lineStyle: {
                    color: '#DCE2E8'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#556677'
                },
                // 默认x轴字体大小
                fontSize: 12,
                // margin:文字到x轴的距离
                margin: 15,
                rotate: 20
            },
            axisPointer: {
                label: {
                    padding: [0, 0, 10, 0],
                    margin: 15,
                    fontSize: 12,
                    backgroundColor: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#fff' // 0% 处的颜色
                        }, {
                            offset: 0.86,
                            color: '#fff' // 0% 处的颜色
                        }, {
                            offset: 0.86,
                            color: '#33c0cd' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#33c0cd' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            },
            boundaryGap: false
        }],
        yAxis: {
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#DCE2E8'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#556677'
                }
            },
            splitLine: {
                show: false
            }
        },
        series: [{
                name: '已收',
                type: 'line',
                data: data.map(it => it.received),
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: '#9effff'
                        },
                        {
                            offset: 1,
                            color: '#9E87FF'
                        }
                    ]),
                    shadowColor: 'rgba(158,135,255, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
                },
                itemStyle: {
                    normal: {
                        color: colorList[0],
                        borderColor: colorList[0]
                    }
                }
            }, {
                name: '应收',
                type: 'line',
                data: data.map(it => it.total),
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                            offset: 0,
                            color: '#73DD39'
                        },
                        {
                            offset: 1,
                            color: '#73DDFF'
                        }
                    ]),
                    shadowColor: 'rgba(115,221,255, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
                },
                itemStyle: {
                    normal: {
                        color: colorList[1],
                        borderColor: colorList[1]
                    }
                }
            },
            {
                name: '未收',
                type: 'line',
                data: data.reduce((res, it) => {
                    res.push(it.receiving)
                    return res
                }, []),
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: '#fe9a'
                        },
                        {
                            offset: 1,
                            color: '#fe9a8b'
                        }
                    ]),
                    shadowColor: 'rgba(254,154,139, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
                },
                itemStyle: {
                    normal: {
                        color: colorList[2],
                        borderColor: colorList[2]
                    }
                }
            }
        ]
    }
}