interface BatchStats {
  batchId: string;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ payableId: string; error: string }>;
}

export function buildBatchCompletedHtml(stats: BatchStats): string {
  const successRate = ((stats.succeeded / stats.total) * 100).toFixed(2);
  const statusColor = stats.failed > 0 ? '#f59e0b' : '#10b981';

  let errorsHtml = '';
  if (stats.errors.length > 0) {
    errorsHtml = `
      <h3 style="color: #dc2626; margin-top: 24px;">Erros Encontrados:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Payable ID</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Erro</th>
          </tr>
        </thead>
        <tbody>
          ${stats.errors
            .map(
              (err) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${err.payableId}</td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; color: #dc2626;">${err.error}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Processamento de Lote Concluído</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${statusColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Processamento de Lote Concluído</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Lote: ${stats.batchId}</h2>
          
          <div style="background-color: white; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <h3 style="margin-top: 0; color: #4b5563;">Estatísticas do Processamento</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Total de Payables:</td>
                <td style="padding: 8px 0; text-align: right;">${stats.total}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Processados:</td>
                <td style="padding: 8px 0; text-align: right;">${stats.processed}</td>
              </tr>
              <tr style="color: #10b981;">
                <td style="padding: 8px 0; font-weight: bold;">✓ Sucessos:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${stats.succeeded}</td>
              </tr>
              <tr style="color: #dc2626;">
                <td style="padding: 8px 0; font-weight: bold;">✗ Falhas:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${stats.failed}</td>
              </tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold;">Taxa de Sucesso:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: ${statusColor};">${successRate}%</td>
              </tr>
            </table>
          </div>

          ${errorsHtml}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Este é um email automático do sistema Aprove-me.</p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
