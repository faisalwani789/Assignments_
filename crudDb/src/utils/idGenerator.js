const chars=[
  "Q","7","M","A","1","Z","K","4","C","P","8","V","D","R","2","H",
  "N","F","9","T","L","0","X","S","B","5","U","I","W","3","E","Y",
  "6","O","G","J"
]

const idGenerator=()=>{
    let id=''
    for(let i=0;i<12;i++){
        const num=Math.floor(Math.random()*36)
        id=id+chars[num]
    }
    return id
}
export default idGenerator