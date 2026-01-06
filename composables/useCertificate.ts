export const useCertificate = () => {
  const createCertificate = async (scanData: any) => {
    // We expect scanData to contain { url, score, ...fullData }
    try {
      const response = await $fetch('/api/certificates', {
        method: 'POST',
        body: {
          url: scanData.url,
          score: scanData.score,
          data: scanData,
          scanDuration: scanData.scanDuration
        }
      });
      return response;
    } catch (error) {
      console.error('Failed to create certificate:', error);
      throw error;
    }
  };

  return { createCertificate };
};
