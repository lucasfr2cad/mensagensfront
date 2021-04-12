export interface Message {
    id?: number;
    message?: string;
    name?: string;
    profile?: string;
    time?: string;
    isToday?: boolean;
    message2?: string;
    align?: string;
    imageContent?: Array<{}>;
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
}
