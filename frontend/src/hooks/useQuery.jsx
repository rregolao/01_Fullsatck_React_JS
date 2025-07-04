//70. hook para extrair dados da busca "q" query. A idéia por chamar "useMemo" é encapsular o valor de forma quenão altere o estado do componente se ele for acessado, ou seja, o useMemo guarda o valor em algum lugar e não renderiza o componente pela alteração realizada
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function useQuery() {
    //70.Extrai o search que é a string da url
    const {search} = useLocation();

    //70. Passa pra frente o Memo com o dado armazenado pela função anonima chamando o ojeto do JS URLSEARCHPARAMS com o search como argumento. O SearchParams extrai os dados da busca como se fossem objetos
    return useMemo(() => new URLSearchParams(search), [search]);
}
