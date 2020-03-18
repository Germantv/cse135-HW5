import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  mounted () {
    this.renderChart({
      labels: ['Admins', 'Analysts', 'Users'],
      datasets: [
        {
			data: [33, 19, 40],
			backgroundColor: [
				'rgba(122, 10, 29, 1)',
				'rgba(22, 10, 239, 1)',
				'rgba(162, 200, 29, 1)',
			],
        }
      ],
    })
  }
}