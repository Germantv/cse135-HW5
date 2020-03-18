import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mounted () {
    this.renderChart({
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          label: '2020 Logins',
          data: [33, 29, 38],
          fill: false,
          borderCapStyle: 'butt',
          backgroundColor:'rgba(122, 90, 99, 1)',
          borderColor: 'rgba(20, 180, 23, 1)',
        }
      ],
    })
  }
}