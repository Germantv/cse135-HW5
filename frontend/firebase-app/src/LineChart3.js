import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mounted () {
    this.renderChart({
      labels: ['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/7', '3/8', '3/9', '3/10', '3/11', '3/12', '3/13', '3/14', '3/15', '3/16', '3/17'],
      datasets: [
        {
          label: 'March Daily Error Logs',
          data: [33, 29, 38, 43, 72, 83, 72, 19, 21, 14, 13, 34, 33, 29, 24, 53, 29, 38],
          fill: false,
          borderCapStyle: 'butt',
          backgroundColor:'rgba(122, 14, 29, 1)',
          borderColor: 'rgba(240, 10, 23, 1)',
        }
      ],
    })
  }
}