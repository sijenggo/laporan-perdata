import { id } from 'date-fns/locale';
import { format } from "date-fns";

export const formattedDate = (date) =>{
    return format(date, 'yyyy-MM-dd');
};
export const formattedTgl = (date) =>{
    return format(date, 'd MMMM yyyy', {locale: id});
};
export const formattedBulanSaja = (date) =>{
    return format(date, 'MMMM', {locale: id});
};
export const formattedTahunSaja = (date) =>{
    return format(date, 'yyyy', {locale: id});
};

//fungsi kategorikan perkara
export const alur_permohonan = [2, 10, 12, 13, 14, 16, 18, 21, 26, 30, 31, 126, 127, 128, 129, 130, 131];
export const alur_gugatan = [1, 3, 4, 5, 6, 7, 9, 11, 15, 19, 20, 22, 23, 24, 25,  27, 28, 29, 32]; 
export const alur_gugatan_sederhana = [8, 17];