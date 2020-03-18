import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mounted () {
    this.renderChart({
      labels: ['Page Load', 'Start Time', 'End Load'],
      datasets: [
        {
          label: '2020 Average Performance',
          data: [324, 784, 643],
          fill: false,
          borderCapStyle: 'square',
          backgroundColor:'rgba(93, 234, 99, 1)',
          borderColor: 'rgba(230, 10, 123, 1)',
        }
      ],
    })
  }
}