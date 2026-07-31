import { FiZap } from 'react-icons/fi';
import { ModulePlaceholder } from '@components/layout/ModulePlaceholder';

export function IdeasPage() {
  return (
    <ModulePlaceholder
      icon={<FiZap size={24} />}
      title="Generador de Ideas"
      description="Combinaciones aleatorias para inspirarte al instante."
      features={[
        'Generación aleatoria',
        '10 categorías temáticas',
        'Copiar al portapapeles',
        'Guardar favoritas',
        'Historial reciente',
        'Agregar ideas propias',
        'Persistencia local',
      ]}
    />
  );
}
