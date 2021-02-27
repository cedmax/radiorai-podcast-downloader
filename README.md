# Downloader per i podcast di radiorai

## WARNING

Il codice di questo script è un esercizio di stile e non vuole l'utilizzo illegale del materiale disponibile per l'ascolto sul sito di [Rai Play Radio](https://www.raiplayradio.it/).

Leggete con attenzione termini e condizioni del sito; lo script viene offerto senza garanzia di manutenzione.

## ISTRUZIONI

`> yarn`

per lanciare lo script

`> yarn dl <<URL_SHOW>>`

dove `URL_SHOW` è uno degli url degli show disponibili su [Rai Play Radio](https://www.raiplayradio.it/), ad esempio:

```
> yarn dl https://www.raiplayradio.it/programmi/labanof/archivio/puntate/
> yarn dl https://www.raiplayradio.it/playlist/2017/12/Se-questo-e-un-uomo-0738d1ce-04af-4395-827f-4819a56b91da.html
```

NB: La paginazione delle puntate non funziona: per ora per scaricare uno show nella sua completezza è necessario rilanciare lo script per ciascuna pagina
