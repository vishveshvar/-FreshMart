const complementNames={
  'Rice & Grains':['Dairy','Vegetables'],Bakery:['Dairy','Fruits'],Dairy:['Bakery','Fruits'],
  Beverages:['Snacks','Dairy'],Fruits:['Dairy'],Vegetables:['Rice & Grains'],Snacks:['Beverages'],
  'Meat & Seafood':['Vegetables','Rice & Grains']
};
export function buildRecommendations({items,profile,activity=[],history=[],orders=[],cart=[]}){
  const available=items.filter(p=>p.stock>0),categoryOf=id=>items.find(p=>p.id===id)?.category;
  const cartProducts=cart.map(x=>items.find(p=>p.id===x.productId)).filter(Boolean);
  const purchased=orders.flatMap(o=>(o.items||[]).map(x=>({id:x.productId,date:o.date,quantity:x.quantity})));
  const catCounts=list=>list.reduce((out,x)=>{const c=categoryOf(x.id||x.productId);if(c)out[c]=(out[c]||0)+(x.quantity||1);return out},{});
  const browsed=catCounts(activity.filter(x=>x.kind==='view')), bought=catCounts(purchased), inCart=catCounts(cart);
  const preferred=new Set(profile.preferences||[]), cartCats=Object.keys(inCart), boughtCats=Object.keys(bought), browseCats=Object.keys(browsed);
  const score=p=>{
    const pref=preferred.has(p.category)?30:0, browse=(browsed[p.category]||0)*5,
      purchase=(bought[p.category]||0)*5, basket=(inCart[p.category]||0)*12;
    return pref+browse+purchase+basket+(p.isBestSeller?1:0);
  };
  const complementFor=source=>{const n=source.name.toLowerCase(),target=p=>{const x=p.name.toLowerCase();if(n.includes('rice'))return /dal|oil|salt|spice/.test(x);if(n.includes('bread'))return /butter|jam|milk/.test(x);if(n.includes('milk'))return /curd|paneer|butter/.test(x);if(n.includes('tea'))return /sugar|biscuit/.test(x);if(n.includes('fruit')||source.category==='Fruits')return /curd|yogurt/.test(x);return (complementNames[source.category]||[]).includes(p.category)};return target};
  const pairsWithCart=p=>cartProducts.some(source=>complementFor(source)(p));
  const reason=p=>{
    if(pairsWithCart(p))return ['Complements Your Cart',`A thoughtful pairing for ${cartProducts.find(source=>complementFor(source)(p))?.name||'your basket'}.`];
    if(preferred.has(p.category))return ['Based on Your Preferences',`Because ${p.category.toLowerCase()} are one of your favorite departments.`];
    if(browsed[p.category])return ['Based on Your Browsing',`Suggested after you explored ${p.category.toLowerCase()}.`];
    if(bought[p.category])return ['Similar to Your Previous Purchases',`A good match for your past ${p.category.toLowerCase()} orders.`];
    return ['Popular in Your Grocery Store','A neighborhood favorite worth a look.'];
  };
  const unique=list=>[...new Map(list.filter(Boolean).map(p=>[p.id,p])).values()];
  const ranked=available.slice().sort((a,b)=>score(b)-score(a));
  const forYou=ranked.slice(0,8);
  const historyPicks=ranked.filter(p=>boughtCats.some(c=>complementNames[c]?.includes(p.category)||c===p.category)).slice(0,8);
  const frequent=available.map(p=>({...p,_frequency:purchased.filter(x=>x.id===p.id).reduce((n,x)=>n+x.quantity,0)})).filter(p=>p._frequency).sort((a,b)=>b._frequency-a._frequency).slice(0,8);
  const complementary=ranked.filter(p=>pairsWithCart(p)&&!cart.some(x=>x.productId===p.id)).slice(0,8);
  const replenishment=unique(purchased.filter(x=>Date.now()-new Date(x.date||Date.now()).getTime()>5*86400000).map(x=>items.find(p=>p.id===x.id))).filter(p=>p?.stock>0).slice(0,6);
  const browsing=ranked.filter(p=>browseCats.includes(p.category)).slice(0,8);
  return {forYou,history:historyPicks,frequent,complementary,replenishment,browsing,reason,hasHistory:purchased.length>0||activity.length>0};
}
