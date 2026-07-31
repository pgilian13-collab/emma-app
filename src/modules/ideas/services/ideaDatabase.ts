import type { IdeaCategory } from '@modules/ideas/types';

export interface IdeaWordPools {
  subjects: string[];
  actions: string[];
  contexts: string[];
  extras: string[];
}

export const IDEA_DATABASE: Record<IdeaCategory, IdeaWordPools> = {
  anime: {
    subjects: [
      'una chica samurái', 'un chico con ojos heterocromáticos', 'una estudiante mágica',
      'un espadachín legendario', 'una idol con auriculares', 'una hechicera con libélulas',
      'un piloto de mecha', 'una cazadora de demonios', 'una princesa del reino celestial',
      'un artista callejero', 'una mercenaria con katana', 'un shinobi del clan de la sombra',
    ],
    actions: [
      'bajo la lluvia', 'en plena batalla', 'cantando en un escenario',
      'entrenando al amanecer', 'volando entre los edificios', 'en una cita bajo las flores',
      'despidiéndose en la estación', 'atrapado en un loop temporal',
      'siendo poseído por un espíritu', 'en su último día de clases',
    ],
    contexts: [
      'en una ciudad futurista', 'en un santuario abandonado', 'en una academia flotante',
      'en una playa de noche', 'en un festival de verano', 'en una librería polvorienta',
      'en una fábrica en ruinas', 'en las calles de Tokio', 'en una cueva de cristal',
      'en una estación espacial', 'en el tejado de un rascacielos', 'entre pasillos neón',
    ],
    extras: [
      'mientras una melodía suave suena',
      'con pétalos cayendo a su alrededor',
      'con su fiel compañero espiritual',
      'al atardecer',
      'en la hora azul',
      'bajo una luna enorme',
    ],
  },
  fantasia: {
    subjects: [
      'un dragón', 'una elfa del bosque', 'un caballero maldito', 'una hechicera del tiempo',
      'un rey sin corona', 'una dríada', 'un fénix renacido', 'una banshi',
      'un minotropo ciego', 'un lich con corazón', 'un enano con martillo rúnico',
      'una médusa hechizada', 'un licántropo joven', 'un semidiós',
    ],
    actions: [
      'leyendo un libro prohibido', 'forjando una espada sagrada', 'durmiendo en un trono',
      'volando sobre un abismo', 'peleando con su reflejo', 'en una negociación con un demonio',
      'cruzando un portal', 'buscando el último dragón', 'aprendiendo magia de una rana',
      'cantando para las estrellas',
    ],
    contexts: [
      'en una biblioteca infinita', 'en una ciudad suspendida', 'en un bosque de cristal',
      'en una taberna al borde del mundo', 'en una torre de marfil', 'en un castillo de hielo',
      'en un oasis del desierto', 'en las raíces del Árbol Mundo',
      'en el mercado de los sueños', 'en una fortaleza de obsidiana',
    ],
    extras: [
      'donde el tiempo no existe',
      'con runas brillando en su piel',
      'mientras la niebla negra se acerca',
      'con un cuervo como mensajero',
      'rodeado de luciérnagas',
    ],
  },
  'ciencia-ficcion': {
    subjects: [
      'un gato astronauta', 'una androide con conciencia', 'un viajero del tiempo',
      'una piloto de caza', 'un cyborg con recuerdos humanos', 'una IA recién nacida',
      'un explorador de portales', 'una científica exiliada', 'un hacker adolescente',
      'una flota de drones', 'un alienígena en la Tierra', 'un capitán sin nave',
    ],
    actions: [
      'descubriendo una nueva galaxia', 'hackeando una estación orbital',
      'reparando su nave con piezas recicladas', 'huyendo de un enjambre',
      'negociando con una raza desconocida', 'rescatando datos de un satélite moribundo',
      'en medio de un motín', 'descifrando un mensaje antiguo',
      'reprogramando una IA enemiga', 'cayendo hacia un agujero negro',
    ],
    contexts: [
      'en una estación abandonada en Marte', 'en una megaciudad corporativa',
      'en un cinturón de asteroides', 'en una luna helada',
      'en un hangar de naves', 'en una colonia submarina',
      'en un tren magnético interestelar', 'en un planeta de cristal',
      'en un laboratorio secreto', 'en una nube de nanobots',
    ],
    extras: [
      'mientras la gravedad falla',
      'con la energía al 3%',
      'con interferencia en la comunicación',
      'siendo perseguido por la flota imperial',
      'en gravedad cero',
    ],
  },
  paisajes: {
    subjects: [
      'un monasterio en la montaña', 'un pueblo suspendido', 'un lago de cristal',
      'un faro en el acantilado', 'un templo hundido', 'un glaciar azul',
      'un puente colgante', 'un jardín de linternas', 'un mercado flotante',
      'un cañón rojo', 'un bosque de bambú', 'un oasis entre dunas',
    ],
    actions: [
      'al amanecer', 'durante una tormenta', 'en la hora dorada',
      'bajo una lluvia de meteoritos', 'en la quietud de la madrugada',
      'con niebla rodando', 'con auroras boreales',
      'durante un eclipse total', 'en otoño', 'en una nevada eterna',
    ],
    contexts: [
      'en los Himalayas', 'en la Patagonia', 'en una isla volcánica',
      'en el corazón de la taiga', 'en una meseta lunar',
      'en el borde del mundo', 'en un fiordo noruego',
      'en un archipiélago tropical', 'en una meseta de sal',
      'en una sabana africana',
    ],
    extras: [
      'sin una sola persona a la vista',
      'con un ave solitaria sobrevolando',
      'con la luz tamizada entre las hojas',
      'con el viento moviendo las hojas',
    ],
  },
  animales: {
    subjects: [
      'un zorro de nueve colas', 'un búho con gafas', 'un cuervo filósofo',
      'una tortuga samurai', 'un erizo con bufanda', 'un mapache bandido',
      'una foca con burbujas', 'un panda rojo soñador', 'un camaleón cromático',
      'una ballena con cicatrices de estrellas', 'un lince con mirada humana',
      'un lobo que aprendió a sonreír',
    ],
    actions: [
      'leyendo un mapa', 'practicando espadas', 'cuidando un jardín',
      'durmiendo en una hamaca', 'cocinando un estofado',
      'en una búsqueda del tesoro', 'peleando con su sombra',
      'jugando al ajedrez', 'pintando un retrato', 'construyendo una cabaña',
    ],
    contexts: [
      'en una biblioteca subterránea', 'en un claro del bosque', 'en una cabaña en la nieve',
      'en una cueva con estalactitas', 'en un puente de madera',
      'en una balsa en el río', 'en una granja abandonada',
      'en un mercado medieval', 'en un jardín de lotos',
      'en una taberna secreta',
    ],
    extras: [
      'con una pequeña vela iluminando la escena',
      'con huellas en la nieve',
      'bajo un paraguas de hojas',
      'con luciérnagas a su alrededor',
    ],
  },
  monstruos: {
    subjects: [
      'un kraken adolescente', 'un golem de barro', 'una hidra de tres cabezas',
      'un slime con sombrero', 'un esqueleto con guitarra', 'un demonio melancólico',
      'un vampiro vegetariano', 'una momia fashionista', 'un fantasma travieso',
      'un hada con dientes de sable', 'un troll bibliotecario',
      'un siervo del inframundo, arrepentido',
    ],
    actions: [
      'paseando por un centro comercial', 'bañándose en un río de lava',
      'tomando el té con una familia humana', 'estudiando para un examen',
      'aprendiendo a tocar el piano', 'en una terapia de grupo',
      'paseando a su perro', 'viendo comedias románticas',
      'perdido en una ciudad', 'peleando contra sus inseguridades',
    ],
    contexts: [
      'en una ciudad moderna', 'en una fiesta de pijamas',
      'en un supermercado de madrugada', 'en un tren nocturno',
      'en un estudio de yoga', 'en la parada del bus',
      'en una biblioteca pública', 'en su departamento minimalista',
      'en una cafetería hipster', 'en una clase de cocina',
    ],
    extras: [
      'con el sol filtrándose por la ventana',
      'mientras suena una alarma desconocida',
      'cubierto de migajas',
      'tratando de pasar desapercibido',
    ],
  },
  chibi: {
    subjects: [
      'un rey chibi con corona enorme', 'un hada con tutú rosa',
      'un café con cara', 'un pincel kawaii', 'un peluche guerrero',
      'un cactus con lentes', 'un gato con bufanda de estrella',
      'una nube con expresión', 'una taza sonriente', 'un sushi criminal',
      'una planta tímida', 'un paraguas parlante',
    ],
    actions: [
      'saltando entre charcos', 'compartiendo un secreto',
      'organizando una fiesta', 'siendo aplastado por un libro',
      'pintando estrellas', 'persiguiendo una luciérnaga',
      'durmiendo sobre una flor', 'regalando un corazón',
      'siendo perseguido por una sombra', 'limpiando una lágrima',
    ],
    contexts: [
      'en un jardín de cerezos', 'en una cocina diminuta',
      'en una taza de té', 'en una nube esponjosa',
      'en una caja de música', 'en un cajón abierto',
      'sobre un libro ilustrado', 'en una pecera',
      'en una ventana con lluvia', 'en una mesa de madera',
    ],
    extras: [
      'con brillos y corazones',
      'con movimientos descoordinados',
      'con un mini arcoíris',
      'con globos de pensamiento',
    ],
  },
  robots: {
    subjects: [
      'un robot viejo con un cactus', 'un androide pastelero',
      'un dron explorador', 'un mecha de jardín', 'una IA con forma de tetera',
      'un robot de combate fuera de servicio', 'un exoesqueleto de oficina',
      'un autómata relojero', 'un robot aspirador emocional',
      'un robot que olvidó su propósito', 'una red de nanobots curiosa',
      'un robot granjero',
    ],
    actions: [
      'pintando un atardecer', 'tocando el violín',
      'estudiando poesía', 'recolectando flores',
      'aprendiendo a dormir', 'cuidando a un gato',
      'haciendo origami', 'construyendo su propio reemplazo',
      'bailando tango', 'mirando las nubes',
    ],
    contexts: [
      'en una fábrica desmantelada', 'en una azotea con huerta',
      'en un taller desordenado', 'en un parque centenario',
      'en una estación de tren', 'en una feria de pueblo',
      'en un museo de historia natural', 'en una cueva de datos',
      'en una estación de carga', 'en un mercadillo de domingo',
    ],
    extras: [
      'con vapor saliendo de sus articulaciones',
      'con una pieza de repuesto en la mano',
      'mientras una radio vieja crepita',
      'con un engranaje como mascota',
    ],
  },
  escenas: {
    subjects: [
      'un juicio final', 'un mercado de recuerdos', 'una despedida en la estación',
      'una boda entre estaciones', 'un funeral de estrellas',
      'un retrato familiar', 'una pelea en una biblioteca',
      'un desayuno para cinco', 'un incendio bajo control',
      'un robo en un museo', 'un picnic en una tumba',
      'un último viaje en bus',
    ],
    actions: [
      'donde nadie habla', 'donde solo hay gestos',
      'con la cámara en mano', 'en una sola toma',
      'con luces contrastadas', 'en blanco y negro',
      'en formato cinematográfico', 'con cortes rápidos',
      'en silencio absoluto', 'con la música fuera de lugar',
    ],
    contexts: [
      'en un hostal de carretera', 'en una mansión victoriana',
      'en un hospital a las 3am', 'en una escuela de verano',
      'en una terminal de barcos', 'en un circo ambulante',
      'en un café con gatos', 'en un balcón durante una tormenta',
      'en un parking subterráneo', 'en un funeral real',
    ],
    extras: [
      'con un solo rayo de luz',
      'donde el tiempo se detiene',
      'con humo de cigarrillo',
      'donde algo no encaja',
    ],
  },
  personajes: {
    subjects: [
      'un rey que olvidó su nombre', 'una vidente con vendas',
      'un niño con un diario mágico', 'una bailarina con una sola pierna',
      'un viajero con una maleta vacía', 'un pintor daltónico',
      'una mujer con espejos por ojos', 'un verdugo empático',
      'un borracho con una biblioteca', 'una espía jubilada',
      'un relojero de almas', 'un cartero del más allá',
    ],
    actions: [
      'escribiendo cartas que nunca envía', 'siendo el último de su especie',
      'cuidando un jardín de huesos', 'en una búsqueda inútil',
      'aprendiendo a decir su nombre', 'vendiendo recuerdos',
      'rezando a un dios menor', 'disfrazándose de sí mismo',
      'coleccionando silencios', 'construyendo un altar al error',
    ],
    contexts: [
      'en una casa inclinada', 'en una feria de pueblo',
      'en una clínica del insomnio', 'en una estación de buses vacía',
      'en un cementerio de máquinas', 'en un faro sin mar',
      'en una imprenta vieja', 'en una biblioteca circular',
      'en un teatro cerrado', 'en un parque de diversiones oxidado',
    ],
    extras: [
      'con un tic en el ojo',
      'con un tatuaje borroso',
      'con un secreto a voces',
      'con una cicatriz reciente',
    ],
  },
};

export const GENERIC_POOLS: IdeaWordPools = {
  subjects: [
    'un héroe inesperado', 'una figura en sombras', 'un viejo sabio',
    'una criatura sin nombre', 'un viajero con prisa', 'un extraño con paraguas',
  ],
  actions: [
    'buscando respuestas', 'en una decisión imposible', 'siguiendo un mapa antiguo',
    'frente a un espejo roto', 'a punto de cambiar todo',
  ],
  contexts: [
    'en un lugar imposible de ubicar', 'en el umbral entre dos mundos',
    'en una realidad que no debería existir',
  ],
  extras: [
    'con la luz de la última estrella',
    'mientras el cielo se desmorona',
    'donde el silencio es ensordecedor',
  ],
};

export function getPool(category: IdeaCategory): IdeaWordPools {
  return IDEA_DATABASE[category];
}

export function getAllCategories(): IdeaCategory[] {
  return Object.keys(IDEA_DATABASE) as IdeaCategory[];
}