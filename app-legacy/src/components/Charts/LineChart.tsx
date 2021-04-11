import React from 'react'
import GraphHolder from './GraphHolder'
import Chart from "react-apexcharts";
import { ThemeColor } from '../../utils';
interface LineChartsProps {
    title: string,
    series: any[],
    options?: any
}
const LineCharts: React.FC<LineChartsProps> = (props) => {
    const options = {
        chart: {
            toolbar: {
                show: false
            }
        },
        theme:{
            //palette:"palette6"
            monochrome: {
                enabled: true,
                color: ThemeColor('primary').value
            },
        },
        noData: {
            text: "No Data",
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: '14px',
            }
        },
        markers: {
            size: 5
        },
        yaxis: {
            show: true,
        },
        xaxis: {
            type: 'datetime'
        }
    }
    Object.assign(options, props.options)
    return (
        <GraphHolder title={props.title}>
            <div className='chart-scroller'>
                <Chart
                    options={options}
                    series={props.series}
                    width="100%"
                    height={250}
                />
            </div>
        </GraphHolder>
    )
}

export default LineCharts