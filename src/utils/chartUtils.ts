import html2canvas from 'html2canvas';

export async function exportChartToPNG(chartElement: HTMLElement, filename: string = 'chart.png'): Promise<void> {
  try {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting chart:', error);
    throw error;
  }
}

