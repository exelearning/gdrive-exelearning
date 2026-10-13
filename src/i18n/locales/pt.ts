import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const pt: Messages = {
  'home.brandSuffix': 'para o Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Código-fonte',
  'home.title': 'Edite projetos eXeLearning no Google Drive',
  'home.lead':
    'Abra, edite e guarde ficheiros .elpx a partir do Drive, no seu navegador. Os seus ficheiros nunca saem do seu Drive.',
  'home.connect': 'Ligar ao Google Drive',
  'home.connectHint':
    'Adiciona o eXeLearning ao menu “Abrir com” do Drive. Gratuito e de código aberto.',
  'home.connected': 'Ligado ao Google Drive',
  'home.openDrive': 'Abrir o Google Drive',
  'home.newProject': 'Novo projeto no Drive',
  'home.howItWorks': 'Como funciona',
  'home.step1.title': 'Ligue uma vez',
  'home.step1.body':
    'Inicie sessão com o Google e permita que o eXeLearning abra os ficheiros que escolher. Não vê mais nada no seu Drive.',
  'home.step2.title': 'Abra a partir do Drive',
  'home.step2.body':
    'Clique com o botão direito em qualquer ficheiro .elpx e escolha {openWith}. Para começar do zero: Novo → Mais → eXeLearning.',
  'home.step2.openWith': 'Abrir com → eXeLearning',
  'home.menu.preview': 'Pré-visualizar',
  'home.menu.openWith': 'Abrir com',
  'home.menu.download': 'Transferir',
  'home.step3.title': 'Edite, guarde, partilhe',
  'home.step3.body':
    'Guarde no Drive com um clique. Partilhe uma ligação só de leitura para que os alunos abram o projeto sem conta Google.',
  'home.check.title': 'Verificação do sistema',
  'home.check.clientOk': 'Cliente Google configurado',
  'home.check.clientMissing': 'Falta VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'A verificar o editor…',
  'home.check.editorReady': 'Editor pronto',
  'home.check.editorMissing': 'Editor não encontrado em {path}',
  'home.check.notConnected': 'Não ligado ao Google Drive',
  'home.check.requesting': 'A pedir autorização…',
  'home.footer.tagline':
    'eXeLearning para o Google Drive · gratuito e de código aberto',
  'home.footer.privacy': 'Política de privacidade',
  'home.footer.terms': 'Termos de serviço',
  'home.language': 'Idioma',

  'toolbar.back': 'Voltar ao Google Drive',
  'toolbar.authorizeOpen': 'Autorizar e abrir',
  'toolbar.authorizeCreate': 'Autorizar e criar',
  'toolbar.share': 'Partilhar ligação pública',
  'toolbar.shareUnavailable':
    'As ligações públicas não estão configuradas nesta instalação.',
  'toolbar.save': 'Guardar no Drive',
  'toolbar.edit': 'Editar no eXeLearning',
  'toolbar.cannotEdit':
    'Não tem permissão para editar este ficheiro no Google Drive.',
  'toolbar.editorAria': 'Editor eXeLearning',
  'toolbar.viewerAria': 'Visualizador eXeLearning',

  'status.connecting': 'A ligar ao Google Drive…',
  'status.clickAuthorizeOpen': 'Clique em “Autorizar e abrir” para continuar.',
  'status.clickAuthorizePreview':
    'Clique em “Autorizar e abrir” para pré-visualizar este ficheiro.',
  'status.clickAuthorizeCreate':
    'Clique em “Autorizar e criar” para continuar.',
  'status.requestingAuth': 'A pedir autorização ao Google…',
  'status.fetchingMetadata': 'A obter metadados do Google Drive…',
  'status.loadingTemplate': 'A carregar o modelo .elpx em branco…',
  'status.creatingFile': 'A criar o ficheiro no Google Drive…',
  'status.loadingEditor': 'A carregar o editor eXeLearning…',
  'status.openingEditor': 'A abrir o editor…',
  'status.opening': 'A abrir…',
  'status.opened': 'Aberto.',
  'status.openedReadOnly': 'Aberto em modo só de leitura.',
  'status.openedLegacy':
    'Ficheiro antigo aberto. Ao guardar será criado um novo .elpx na mesma pasta.',
  'status.created': 'Criado.',
  'status.unsaved': 'Alterações por guardar.',
  'status.requestingSave': 'A pedir o .elpx atualizado ao editor…',
  'status.checkingRemote': 'A verificar alterações remotas…',
  'status.saveCancelled': 'Gravação cancelada.',
  'status.saved': 'Guardado no Google Drive.',
  'status.readingPackage': 'A ler o pacote…',
  'status.previewLoaded': 'Pré-visualização carregada.',
  'status.legacyFile': 'Ficheiro antigo: clique em Editar para o migrar.',
  'status.fetchingPublic': 'A obter do Google Drive…',
  'status.downloading': 'A transferir…',
  'status.loaded': 'Carregado.',
  'status.sharing': 'A partilhar com qualquer pessoa com a ligação…',
  'status.linkReady': 'Ligação pública pronta.',

  'saving.title': 'A guardar no Drive…',
  'saving.hint': 'Aguarde enquanto o ficheiro é guardado.',
  'saving.failed': 'Falha ao guardar',
  'common.close': 'Fechar',
  'conflict.changed':
    '“{filename}” foi alterado no Google Drive desde que foi aberto.\n\nClique em OK para substituir o ficheiro do Drive, ou em Cancelar para escolher outra opção.',
  'conflict.saveCopy':
    'Guardar o conteúdo do editor como uma nova cópia? Clique em Cancelar para não guardar.',

  'share.title': 'Partilhar “{filename}”',
  'share.generalAccess': 'Acesso geral',
  'share.restricted': 'Restrito',
  'share.restrictedHint':
    'Só as pessoas com acesso no Google Drive o podem abrir.',
  'share.calloutLead':
    'Uma ligação pública muda-o para “Qualquer pessoa com a ligação” como leitor no Google Drive.',
  'share.calloutBody':
    'Qualquer pessoa na Internet com a ligação poderá ver o projeto e transferir o ficheiro .elpx, sem conta Google.',
  'share.cancel': 'Cancelar',
  'share.create': 'Criar ligação pública',
  'share.sharing': 'A partilhar…',
  'share.anyone': 'Qualquer pessoa com a ligação',
  'share.anyoneHint':
    'Qualquer pessoa na Internet com a ligação pode vê-lo. Não é necessário iniciar sessão.',
  'share.viewer': 'Leitor',
  'share.linkLabel': 'Ligação pública para os alunos',
  'share.copy': 'Copiar ligação',
  'share.copied': 'Copiado',
  'share.stopHint':
    'Para deixar de partilhar, volte a definir o acesso geral como Restrito no Google Drive.',
  'share.manage': 'Gerir no Google Drive',
  'share.done': 'Concluído',
  'share.errorTitle': 'Não foi possível criar a ligação pública',
  'share.errorLead': 'O Google Drive recusou a alteração.',
  'share.workspaceHint':
    'O administrador do seu Google Workspace pode restringir “Qualquer pessoa com a ligação”. Ainda assim pode partilhar o ficheiro com pessoas do seu domínio a partir do Google Drive; elas abrem-no com Abrir com → eXeLearning.',

  'viewer.errorTitle': 'Não foi possível abrir este ficheiro',
  'viewer.legacyClickEdit': 'Clique em Editar para o abrir no editor.',
  'viewer.legacyUnsupported':
    'Este ficheiro é de uma versão antiga do eXeLearning e não pode ser pré-visualizado.',
  'viewer.packageUnreadable': 'Não foi possível ler o pacote.',
  'viewer.invalidPackage':
    'Não foi possível ler o ficheiro como um pacote eXeLearning válido.',
  'viewer.noIndex': 'O pacote não contém um index.html.',
  'viewer.notShared':
    'Este ficheiro não está partilhado publicamente (“Qualquer pessoa com a ligação”) ou já não existe no Google Drive.',
  'viewer.downloadForbidden': 'O Google Drive não permite transferir “{name}”.',

  'error.missingClientId':
    'Falta VITE_GOOGLE_CLIENT_ID. Configure-o no seu ambiente antes de usar o Google Drive.',
  'error.publicLinksNotConfigured':
    'As ligações públicas não estão configuradas nesta instalação (falta VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'O Google Identity Services não está carregado.',
  'error.gisNoToken':
    'O Google Identity Services não devolveu um token de acesso.',
  'error.gisTimeout': 'Tempo esgotado ao carregar o Google Identity Services.',
  'error.gisNoOauth':
    'O Google Identity Services foi carregado, mas o OAuth não está disponível.',
  'error.gisLoadFailed': 'Falha ao carregar o Google Identity Services.',
  'error.missingState': 'Falta o estado do Google Drive.',
  'error.invalidState': 'O estado do Google Drive não é válido.',
  'error.stateNoIds':
    'O estado de abertura do Google Drive deve incluir pelo menos um id de ficheiro.',
  'error.stateIdsStrings':
    'Os ids de ficheiro do Google Drive devem ser cadeias de texto.',
  'error.resourceKeysObject':
    'As chaves de recurso do Google Drive devem ser um objeto.',
  'error.resourceKeysStrings':
    'Os valores das chaves de recurso do Google Drive devem ser cadeias de texto.',
  'error.openOnly':
    'Este ponto de entrada só suporta ações de abertura do Google Drive.',
  'error.createOnly':
    'Este ponto de entrada só suporta ações de criação do Google Drive.',
  'error.missingFileId': 'Falta fileId na ligação pública.',
  'error.invalidFileId': 'O fileId da ligação pública não é válido.',
  'error.readOnlyFile':
    'Este ficheiro do Google Drive é só de leitura e não pode ser substituído.',
  'error.driveFailed': 'O pedido ao Google Drive falhou.',
  'error.missingContent': 'Falta o conteúdo do ficheiro do Drive.',
  'error.noUploadSession':
    'O Drive não devolveu um URL de sessão de carregamento retomável.',
  'error.swUnavailable':
    'Os Service Workers não estão disponíveis neste contexto do navegador.',
  'error.swInactive': 'O Service Worker do eXeLearning não está ativo.',
  'error.swRejected': 'O Service Worker rejeitou a mensagem.',
  'error.notZip': 'Não é um arquivo ZIP',
  'error.zipDecode': 'Falha ao descomprimir o ZIP',
  'error.tooManyEntries': 'O pacote tem mais de {max} entradas',
  'error.unsafeEntry': 'Caminho de entrada não seguro: {name}',
  'error.packageTooLarge':
    'O pacote excede o limite de tamanho comprimido ({size} > {max})',
  'error.decompressedTooLarge':
    'O pacote descomprimido excede o limite ({size} > {max})',
  'error.editorNotReady': 'O editor eXeLearning ainda não está pronto.',
  'error.editorFrameMissing': 'O iframe do editor não está disponível.',
  'error.savePayloadNoBytes':
    'O editor devolveu uma gravação sem dados binários.',
};

export default pt;
