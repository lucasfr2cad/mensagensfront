import { SafeResourceUrl } from '@angular/platform-browser';
export interface Message {
    id?: number;
    message?: string;
    name?: string;
    profile?: string;
    time?: string;
    isToday?: boolean;
    message2?: string;
    align?: string;
    imageContent?: SafeResourceUrl;
    isimage?: boolean;
    isfile?: boolean;
    fileContent?: string;
    fileSize?: string;
    istyping?: boolean;
    ds_corpo?: string;
    dt_criacao?: string;
    ds_remetente?: string;
    ds_destinatario?: string;
    st_de_mim?: boolean;
    vl_status?: number;
    ds_nome_contato_curto?: string;
    st_midia?: boolean;
  // tslint:disable-next-line: variable-name
   ds_mimetype?: string;
  // tslint:disable-next-line: variable-name
  ds_data?: string;
  // tslint:disable-next-line: variable-name
  ds_nome_do_arquivo?: string;
  cd_codigo?: string;
  st_citacao?: boolean;
  ds_id_mensagem_whatsapp_serializado?: string;
  ds_corpo_citado?: string;
  ds_id?: string;
  ds_id_mensagem_whatsapp?: string;
}
