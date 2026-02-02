export function buildDLQNotificationHtml(
  batchId: string,
  payableId: string,
  error: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Alerta: Payable na Dead Letter Queue</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">🚨 ALERTA: Payable na DLQ</h1>
        </div>
        
        <div style="background-color: #fef2f2; padding: 20px; border: 2px solid #dc2626; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #991b1b; margin-top: 0;">Ação Requerida</h2>
          
          <p style="font-size: 16px; margin: 16px 0;">
            Um payable foi movido para a <strong>Dead Letter Queue (DLQ)</strong> após exceder o limite de 4 tentativas de processamento.
          </p>

          <div style="background-color: white; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #dc2626;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Lote ID:</td>
                <td style="padding: 8px 0; font-family: monospace;">${batchId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payable ID:</td>
                <td style="padding: 8px 0; font-family: monospace;">${payableId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Erro:</td>
                <td style="padding: 8px 0; color: #dc2626;">${error}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">Próximos Passos:</h3>
            <ol style="margin: 8px 0; padding-left: 20px; color: #78350f;">
              <li>Investigar a causa raiz do erro</li>
              <li>Verificar se o assignor existe no sistema</li>
              <li>Corrigir os dados se necessário</li>
              <li>Reprocessar manualmente se apropriado</li>
            </ol>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #fecaca; font-size: 12px; color: #991b1b;">
            <p><strong>⚠️ Este é um alerta crítico que requer atenção imediata.</strong></p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
