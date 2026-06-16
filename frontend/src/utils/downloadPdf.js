export async function downloadPdf(vehicle) {
  if (!vehicle.bootHoistPdf) return;
  const response = await fetch(vehicle.bootHoistPdf);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${vehicle.manufacturer}_${vehicle.model}_Installation_Guide.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
