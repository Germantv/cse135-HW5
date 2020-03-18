import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
		//type: 'horizontalBar',
		// data on x-axis
		labels: ['Page Load Time', 'End Load Time', 'Start Time'],
		datasets: [
			{
				//type: 'horizontalBar',
				label: 'Average Load Times',
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
				],
				// data on y-axis
				data: [543, 655, 748, 393, 642, 432, 547, 840, 450, 520, 512, 611],
			}
		],
    })
  }
}