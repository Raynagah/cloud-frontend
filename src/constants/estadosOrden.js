export const ESTADOS_ORDEN = {
  PROCESADO: { label: 'Orden Procesada', color: '#2563eb', bg: '#dbeafe', icon: '📝', pasoIndex: 0 },
  EN_PREPARACION: { label: 'En Preparación', color: '#d97706', bg: '#fef3c7', icon: '📦', pasoIndex: 1 },
  EN_TRANSITO: { label: 'En Tránsito', color: '#7c3aed', bg: '#ede9fe', icon: '🚚', pasoIndex: 2 },
  ENTREGADO: { label: 'Entregado', color: '#16a34a', bg: '#dcfce7', icon: '✅', pasoIndex: 3 },
  CANCELADO: { label: 'Cancelado', color: '#dc2626', bg: '#fee2e2', icon: '❌', pasoIndex: -1 }
};

export const PASOS_SECUENCIA = [
  { key: 'PROCESADO', label: ESTADOS_ORDEN.PROCESADO.label, icon: ESTADOS_ORDEN.PROCESADO.icon },
  { key: 'EN_PREPARACION', label: ESTADOS_ORDEN.EN_PREPARACION.label, icon: ESTADOS_ORDEN.EN_PREPARACION.icon },
  { key: 'EN_TRANSITO', label: ESTADOS_ORDEN.EN_TRANSITO.label, icon: ESTADOS_ORDEN.EN_TRANSITO.icon },
  { key: 'ENTREGADO', label: ESTADOS_ORDEN.ENTREGADO.label, icon: ESTADOS_ORDEN.ENTREGADO.icon }
];