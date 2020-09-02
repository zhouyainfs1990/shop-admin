<template>
    <div class="container">
        <el-row justify="center" type="flex" :gutter="10">
            <el-col :span="11">
                <h2>商品总览</h2>
                <div class="box">
                    <div>01</div>
                    <div>02</div>
                    <div>03</div>
                    <div>04</div>
                </div>
            </el-col>
            <el-col :span="11">
                <h2>用户总览</h2>
                <div class="box">11</div>
            </el-col>

        </el-row>
        <el-row justify="center" type="flex">
            <el-col :span="20">
                <div id="main" style="height:400px;">

                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import echarts from "echarts"
import Highcharts from "highcharts"
export default {
    mounted(){
        /* // 1.初始化一个图标实例
        var myChart = echarts.init(document.getElementById("main"));

        //2. 图标配置对象
        var option = {
            toolbox:{
                feature:{
                    saveAsImage:{}
                },
                width:30,
                right:80
            },
            legend:{
                data:["第一周销量","第二周销量"]
            },
            // x 轴
            xAxis:{
                type:"category",
                data:["周一","周二","周三","周四","周五","周六","周日"],
                boundaryGap:false
            },
            // y 轴
            yAxis:{
                type:"value"
            },
            // 图表数据
            series:[{
                name:"第一周销量",
                type:"line",
                data:[500,750,620,550,340,490,730]
            },{
                name:"第二周销量",
                type:"line",
                data:[200,750,520,650,440,690,530]
            }]
        }
        // 3.给图标设置配置项

        myChart.setOption(option) */

        let option = {
            xAxis:{
                categories:["周一","周二","周三","周四","周五","周六","周日"],
            },
            // y 轴
            yAxis:{
                title:"数据"
            },
            colors: ["red","yellow"],
            // 图表数据
            series:[{
                name:"第一周销量",
                type:"line",
                data:[500,750,620,550,340,490,730]
            },{
                name:"第二周销量",
                type:"line",
                data:[200,750,520,650,440,690,530]
            }]
        }

        Highcharts.chart("main",option)
    }
}
</script>
<style lang="">
    .container{
        width: 80%;
        margin: 0 auto;
        border: 1px solid #ccc;
    }
    .box{
        background: pink;
        border: 1px solid red;
        display: flex;
    }
    .box div{
        flex:1;
        text-align: center;
    }
</style>