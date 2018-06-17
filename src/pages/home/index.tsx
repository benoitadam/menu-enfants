import { h, Component, VNode } from 'preact';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import translates from '../../translates';
import './style.css';
import GamepadManager from 'common/GamepadManager';

// (() => {
//   var keys = translates.keys;
//   var res = {};
//   for(var lang in translates) {
//     res[lang] = {};
//   }
//   delete res['keys'];
//   for(var i=0, l=keys.length; i<l; i++) {
//     var key = keys[i];
//     for(var lang in res) {
//       res[lang][key] = translates[lang][key];
//     }
//   }
// })();
// console.log()
//translates.fr = [];

var texts = [];
var indexByText = {};
window['texts'] = texts;
setTimeout(() => { console.log(JSON.stringify(texts)); }, 2000);

var lang$ = new BehaviorSubject('fr');
var tr$ = lang$.map(lang => translates[lang]);

new GamepadManager().onButtonChanged = (gamepadId, buttonId, value) => {
  console.log('onButtonChanged', gamepadId, buttonId, value);
  switch (buttonId) {
    case 0: lang$.next('fr'); break;
    case 1: lang$.next('en'); break;
    case 2: lang$.next('es'); break;
    case 3: lang$.next('de'); break;
    case 4: lang$.next('zh'); break;
    default: break;
  }
};



type TextProps = { class?, value: string };
export class Tr extends Component<TextProps, { value: string }> {
  sub;
  index;
  constructor(props: TextProps) {
    super(props);
    const { value } = props;
    this.state = { value };
    
    // create texts for create translates
    this.index = indexByText[value];
    if (this.index === undefined) {
      indexByText[value] = this.index = texts.length;
      texts.push(value);
    }
  }
  componentDidMount() {
    this.sub = tr$.subscribe(translates => {
      var value = translates[this.index];
      if (value !== undefined) {
        this.setState({ value });
      }
    });
  }
  componentWillUnmount() {
    this.sub.unsubscribe();
  }
  render({ class:cls }: TextProps, { value }) {
    return cls ? <span class={cls}>{value}</span> : value;
  }
}



type LanguageProps = { class?, lang: string, image: string, title: string };
export class Language extends Component<LanguageProps, { current: boolean }> {
  sub;

  constructor(props: LanguageProps) {
    super(props);
    this.state = { current: false };
  }

  componentDidMount() {
    this.sub = lang$.subscribe(lang => {
      this.setState({ current: lang === this.props.lang });
    });
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  _onClick = () => {
    lang$.next(this.props.lang);
  }

  render({ class:cls, image, title, ...rest}: LanguageProps, { current }) {
    return (
      <div class={ (current?'language language-current ':'language ') + (cls||'')} onClick={this._onClick} {...rest}>
        <div class="language_image" style={{ backgroundImage: `url(${image})` }} />
        <div class="language_title">{title}</div>
      </div>
    )
  }
}



type SlyderProps = { children?: VNode[] };
type SliderState = { enter: number; leave: number; };
export class Slider extends Component<SlyderProps, SliderState> {
  interval: any;
  state = {
    enter: -1,
    leave: -1
  };
  
  componentDidMount() {
    let i = 0;

    setTimeout(() => this.setState({ enter: 0 }), 50);

    this.interval = setInterval(
      () => {
        i++;
        const count = this.props.children.length;
        this.setState({
          enter: i % count,
          leave: (i - 1) % count
        });
      },
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { children } = this.props;
    const { enter, leave } = this.state;
    children && children.forEach((child, i) => {
      child.attributes._cls = (i === enter ? 'slide-enter ' : i === leave ? 'slide-leave ' : '')
    });
    return (
      <div class="slider">
        {children}
      </div>
    );
  }
}
//  + 
type SlideProps = { image?:string, title?:string, desc?:string, class?:string, children?, _cls?:string }
const Slide = ({ children, image, title, desc, class:cls, _cls }: SlideProps) => (
  <div class={'slide ' + (_cls||'') + (cls||'')}>
    <div class="slide_bg" style={{ backgroundImage: 'url(' + image + ')' }} />
    <div class="slide_content">
      {title && <Tr class="slide_title" value={title} />}
      {desc && <Tr class="slide_desc" value={desc} />}
      {children}
    </div>
  </div>
);
// {content.map((item, itemIndex) => 
//   <div key={itemIndex} class={'slide_text ' + item.textClass}>{item.text}</div>
// )}



const Price = ({ cl, count, text, val, ...rest }: { cl?, count?, text?, val? }) => (
  <div class="price" {...rest}>
    {text && <span class="price_text">{text}</span>}
    {cl && <span class="price_volume">{cl}</span>}
    {cl && <span class="price_volume_cl">cl</span>}
    {count && <span class="price_count">{count}</span>}
    {val && <span class="price_value">{val}</span>}
    {val && <span class="price_currency">€</span>}
  </div>
);
const Layout = (p) => <div class="layout" {...p} />
const Column = (p) => <div class="column" {...p} />
const Columns = (p) => <div class="columns" {...p} />
const Row = (p) => <div class="row" {...p} />
const Rows = (p) => <div class="rows" {...p} />
const Line = (p) => <div class="line" {...p} />
const SmallLine = (p) => <div class="line line-small" {...p} />

const Block = (p) => <div class="block" {...p} />

const Category = ({ children, title, ...rest }: { children?, title:string }) =>
  <div class="category" {...rest}>
    <h2 class="category_title"><Tr value={title} /></h2>
    {children}
  </div>

const Product = ({class: cls, children, title, desc, price, label, ...rest}: { class?, children?, title?:string, desc?:string, price?, label? }) =>
  <div class={'product ' + cls} {...rest}>
    <div class="product_body">
      {title && <h3 class="product_title"><Tr value={title} /></h3>}
      {desc && <Tr class="product_desc" value={desc} />}
    </div>
    <div class="product_prices">
      {typeof price === 'number' ? <Price val={price} /> : price}
    </div>
    {children}
  </div>

const Space = (p) => <div class="space" {...p} />

const Carte = ({ children, header, ...rest }: { children?, header }) =>
  <div class="carte" {...rest}>
    <h1 class="carte_header">{header}</h1>
    <div class="carte_body">{children}</div>
  </div>

const Languages = (p) => <div class="languages" {...p} />

const Title = ({ class: cls, children, text, desc, ...rest }: { class?, children?, text?, desc? }) =>
  <div class={'title ' + cls} {...rest}>
    <span class="title_header">{text}</span>
    <span class="title_desc">{desc}</span>
    {children}
  </div>

const Title2 = (p) => <Title class="title2" {...p} />
const Title3 = (p) => <Title class="title3" {...p} />

const Info = ({ class: cls, children, text, ...rest }: { class?, children?, text? }) =>
  <div class={'info ' + cls} {...rest}>{text}{children}</div>

export default class HomePage extends Component<any, any> {
  gamepadManager;
  render() {
    return (
      <Layout>
        
        {/* <Carte header="Les boissons">

          <Title text="Soft Cocktails"><Price cl={35} val={6.5} /></Title>
          <Product title="Le Marie Galante" desc="orange juice, pineapple juice, guava juice" />
          <Product title="Le Voyageur" desc="pineapple juice, guava juice, peach juice" />
          <Product title="L’Antillais" desc="cranberry juice, guava juice, pineapple juice" />
          <Product title="Le Naf-Naf" desc="fresh orange and lemon juice" />
          <Product title="Le Virgin Mojito with Perrier" />

          <Title text="Cocktails with alcohol"><Price cl={28} val={9} /></Title>
          <Product title="L’Apérol Spritz with Prosecco" />
          <Product title="L’Américano" desc="homemade" />
          <Product title="Le Sex on the Beach" desc="Vodka, Cointreau, orange juice, cranberry juice" />
          <Product title="Le Cosmoterrible" desc="Vodka, triple sec, cranberry, lime" />
          <Product title="Le Classique Mojito au Rhum Agricole" desc="lime and fresh mint" />
          <Product title="Le Mojito aux fruits" desc="peach, strawberry, raspberry, cranberry or pineapple" />
          <Product title="La Pina Colada" desc="Rum, coconut milk, pineapple juice, Angostura" />
          <Product title="Le Planteur Antillais" desc="Rum, guava juice, pineapple juice, orange juice" />

          <Title text="Cocktails with Louis Roederer Champagne"><Price cl={12} val={12} /></Title>
          <Product title="Glass of champagne with lots of ice cubes" />
          <Product title="Le French Kiss" desc="with fresh strawberries and Roederer Champagne" />
          <Product title="Le Monégasque" desc="with fresh raspberries and Roederer Champagne" />
          <Product title="Le Mentonnais" desc="with fresh orange juice and Roederer Champagne" />
          <Product title="Le Bellini " desc="with peach nectar" />
          <Product title="Le Royal Mojito with Champagne" />

          <Title text="Specialities « des Enfants Terribles’s »" />
          <Product title="La Sangria" desc="with red fruits and citrus fruits from Menton"><Price cl={25} val={6.5} /></Product>
          <Product title="The authentic Bloody Mary" desc="with homemade tomato juice, IT’S A KILLER !"><Price cl={25} val={9} /></Product>
          <Info text="All our aperitifs are served with a conviviality plate" />

          <Title text="Traditional Aperitifs" />
          <Product title="Ricard, Pastis 51" ><Price cl={4} val={3.5} /></Product>
          <Product title="Martini, Suze, Campari, Porto" ><Price cl={6} val={6} /></Product>
          <Product title="Pastis artisanal Henri Bardouin" ><Price cl={4} val={4} /></Product>
          <Product title="Muscat de Beaumes de Venise"><Price cl={10} val={6} /></Product>
          <Product title="Handmade wine fruits" desc="peach, orange, walnut"><Price cl={10} val={6} /></Product>
          <Product title="Kir with white wine" desc="blackcurrant, blackberry, peach, raspberry"><Price cl={12} val={5} /></Product>
          <Product title="Glass of Prosecco"><Price cl={12} val={6} /></Product>
          <Product title="Glass of Louis Roederer Champagne"><Price cl={12} val={10} /></Product>
          <Product title="Kir Royal with Champagne"><Price cl={12} val={10} /></Product>
          <Product title="Traditional alcohols" desc="Gin, Vodka, Rhum, Tequila"><Price cl={6} val={8} /></Product>
          <Info text="Free side dish" />

          <Title2 text="Our Whiskys" />
          <Product title="Clan Campbell, Ballantines" ><Price cl={6} val={8} /></Product>
          <Product title="Jack Daniel, Chivas 12 ans d’âge" ><Price cl={6} val={10} /></Product>
          <Product title="Bushmills 10 ans d’âge, Chivas 18 ans d’âge" ><Price cl={6} val={12} /></Product>
          <Info text="Free side dish" />
          <Product title="Blond Paulaner beer on draught"><Price cl={25} val={3.5} /><Price cl={50} val={6.5} /></Product>
          <Product title="White Hœgaarden beer on draught"><Price cl={25} val={4} /><Price cl={50} val={7.5} /></Product>

          <Title2 text="Softs" />
          <Product title="Fruits juice" desc="Orange, pineapple, guava, cranberry, peach"><Price cl={33} val={3.5} /></Product>
          <Product title="Sodas" desc="Coca, Perrier, Orangina, Tonic, Limonade, Ice Tea"><Price cl={33} val={3.5} /></Product>
          <Product title="Fresh lemon or orange juice"><Price cl={20} val={5} /></Product>
          <Product title="Still or sparkling mineral water"><Price cl={37.5} val={3.5} /><Price cl={75} val={5.5} /></Product>

          <Title2 text="Les Verres de Vins"><Price cl={15} /></Title2>
          <Product title="Le Château Pas du Cerf" desc="Côtes de Provence AOP rouge, rosé, blanc"><Price val={4.5} /></Product>

          <Block>
            <Title3 title="Les vins de cépages « des Enfants Terribles»" />
            <Product title="Blanc" desc="Chardonnay, Sauvignon"><Price val={6} /></Product>
            <Product title="Rouge" desc="Syrah, Pinot noir"><Price val={6} /></Product>
          </Block>

          <Product title="Le rosé cuvée prestige de Minuty millésime 2017" desc="Côtes de Provence AOP"><Price val={9} /></Product>
          <Product title="Le rosé cœur de grain Domaine Ott" desc="Côtes de Provence AOP"><Price val={12} /></Product>
          <Product title="Le blanc de blanc, Domaine du Paternel" desc="Cassis AOP"><Price val={9} /></Product>
          <Product title="Le blanc du Château Saint-Martin" desc="Chablis AOP"><Price val={12} /></Product>
          <Product title="Le blanc du Château Mont-Redon" desc="Châteauneuf du Pape AOP"><Price val={15} /></Product>
          <Product title="Le rouge du Château Salettes " desc="Mourvèdre Bandol AOP"><Price val={9} /></Product>
          <Product title="Le rouge 2011, Terre des ainés, Maison Montirius " desc="Gigondas AOP"><Price val={12} /></Product>
          <Product title="Le rouge 2012, La Closerie de Fourtet " desc="Saint-Emilion grand cru"><Price val={15} /></Product>

        </Carte> */}

        <Carte header="La carte">

          <Title text="Homemade tapas" desc="to share with family and friends while your wait for your meal" />
          <Columns>
            <Block>
              <Title2 text="Sea side" />
              <Product title="Calamari fritters" />
              <Product title="Bowl of mussels cooked in white wine" />
              <Product title="Seafood salad" />
              <Product title="Italian octopus salad" />
              <Product title="2 larges king prawns grilled a la plancha" />
              <Product title="2 mini bruschetta with smoked salmon" />
            </Block>
            <Block>
              <Title2 text="Land side" />
              <Product title="Mixed of melon and cured ham" />
              <Product title="Warm toast of camembert cheese" />
              <Product title="Homemade toast of foie gras with fig chutney" />
              <Product title="Bruschetta of goat ‘s cheese and honey" />
              <Product title="2 chicken rolls with fresh mint" />
            </Block>
            <Block>
              <Product title="3 tapas of your choice"><Price val={15} /></Product>
              <Product title="6 tapas of your choice"><Price val={25} /></Product>
              <Product title="9 tapas of your choice"><Price val={40} /></Product>
            </Block>
          </Columns>

          <Block>
            <Title text="OUR SPECIALITY" desc="Seafood grilled in the oven and flambéed with cognac"><Price val={39} /></Title>
            <Info text="Served for 1 or 2 peoples" />
            <Product title="6 oysters « fine de claire N°2 / 3 large king prawns" />
            <Product title="3 langoustines / mussels/ scallops/ razors shells" />
            <Info text="Seafood grilled in the oven" />
          </Block>

          <Title text="Warm oysters by 6" />
          <Product title="6 oysters in parmesan gratin Breadcrumbs, and garlic and parsley"><Price val={18} /></Product>
          <Product title="6 Stuffed oysters In leek fondue flavoured with yellow curry"><Price val={20} /></Product>
          <Product title="6 Rockfeller’s oysters With spinach, cured ham and cream"><Price val={20} /></Product>
          <Product title="6 oysters bienvilles New Orlean’s speciality with king prawns, mushrooms and béchamel sauce"><Price val={22} /></Product>
          <Product title="6 oysters in gratin With foie gras, smoked duck breast and lavender honey"><Price val={22} /></Product>
          <Product title="6 oysters in gratin with champagne Grated cheese and light cream"><Price val={22} /></Product>

          <Title2 text="Tasting of 12 warm oysters"><Price val={42} /></Title2>
          <Product title="6 times 2 oysters of each recipe" desc="Served for one or two persons" />

          <Title text="Seafood according to availability" />
          <Product title="Oysters « Fines de claire N°2»"><Price count={6} val={16} /><Price count={12} val={30} /></Product>
          <Product title="Oysters « Gillardeau N°5»"><Price count={6} val={18} /><Price count={12} val={35} /></Product>
          <Product title="Oysters « Gillardeau N°3»"><Price count={6} val={24} /><Price count={12} val={45} /></Product>
          <Product title="Cooked whelks"><Price count={12} val={8} /><Price count={24} val={15} /></Product>
          <Product title="Cooked whole crab and it’s aioli (garlic mayonnaise)"><Price val={21} /></Product>
          <Product title="Raw Langoustines"><Price count={3} val={14} /><Price count={6} val={28} /></Product>
          <Product title="Urchin"><Price count={6} val={18} /><Price count={12} val={35} /></Product>
          <Product title="Cooked king prawns"><Price count={6} val={16} /><Price count={12} val={30} /></Product>
          <Product title="1/2 lobster and it’s aioli (garlic mayonnaise)"><Price val={25} /></Product>

          <Title text="The small oysters tasting platters" />
          <Product label={1} title="«3 fines de claire N°2» and «3 Gillardeau N°5»"><Price val={17} /></Product>
          <Product label={2} title="«3 fines de claire N°2» and «3 Gillardeau N°3»"><Price val={22} /></Product>
          <Product label={3} title="«3 Gillardeau N°5», «3 Gillardeau N°3»"><Price val={22} /></Product>
          <Product label={4} title="«3 fines de claire N° 2», «3 Gillardeau N°5», «3 Gillardeau N°3»"><Price val={29} /></Product>
          <Product title="Add 3 large kind prawns on your platter for"><Price val={8} /></Product>

          <Title text="Oyster’s platter « Fines de Claires »"><Price val={42} /></Title>
          <Product title="12 oysters Fines de claire N°2" />
          <Product title="6 cooked prawns/ 6 whelks" />

          <Title text="Tasting platter"><Price val={85} /></Title>
          <Product title="4 oysters Fines de claires N°2" />
          <Product title="4 Oysters Gillardeau N°5" />
          <Product title="4 Oysters Gillardeau N°3 / 2 langoustines" />
          <Product title="4 large king prawns" />
          <Product title="1 crab / 12 whelks / 2 Urchin" />

          <Title text="Special “papillons oysters” platter"><Price val={46} /></Title>
          <Product title="12 Oysters « Gillardeau N°5»" />
          <Product title="6 large king prawns / 6 whelks" />

          <Title text="The « terrible » platter"><Price val={108} /></Title>
          <Product title=" 12oysters Fines de claire N°2" />
          <Product title="6 Oysters Gillardeau N°5" />
          <Product title="6 Oysters Gillardeau N°3 / 4 langoustines" />
          <Product title="4 large king prawns / 12 whelks / 4 Urchin" />

          <Title text="Spécial «Gillardeau oysters» platter"><Price val={54} /></Title>
          <Product title="6 Oysters Gillardeau N°3 / 6 Oysters Gillardeau N°5" />
          <Product title="6 large king prawns / 6 whelks" />

          <Title text="The royal platter"><Price val={178} /></Title>
          <Product title="8 oysters Fines de Claire N°2 / 8 Oysters Gillardeau N°5" />
          <Product title="8 Oysters Gillardeau N°3 / 6 langoustines" />
          <Product title="6 large king prawns / 1 crab" />
          <Product title="1 lobster / 12 whelks / 6 Urchin" />

          <Title text="Out at sea platter"><Price val={68} /></Title>
          <Product title="6 oysters Fines de claires N°2" />
          <Product title="6 Oysters Gillardeau N°5 / 6 Oysters Gillardeau N°3" />
          <Product title="6 large king prawns, 6 whelks" />

          <Info text="«To guarantee the freshness, we may sometimes run out of some products.»" />

          <Title text="Starters according to availability" />
          <Product title="Fresh razor shell sautéed in garlic and parsley"><Price val={12} /></Product>
          <Product title="Chicken rolls with fresh mint"><Price val={12} /></Product>
          <Product title="Red peppers grilled and marinated in olive oil"><Price val={14} /></Product>
          <Product title="Italian seafood salad"><Price val={16} /></Product>
          <Product title="The «Enfants Terribles» octopus summer salad"><Price val={16} /></Product>
          <Product title="Tuna tartare with fresh herbs"><Price val={16} /></Product>
          <Product title="Fish soup, saffron mayonnaise and garlic croutons"><Price val={16} /></Product>
          <Product title="Saint Marcelin cheese roasted in the oven,"><Price val={16} /></Product>
          <Product title="mixed salad and with fig chutney" />
          <Product title="King prawns tempura" desc="6 pieces"><Price val={18} /></Product>
          <Product title="Japanese tuna Tataki"><Price val={18} /></Product>
          <Product title="Smoked salmon carpaccio with Yuzu beads"><Price val={18} /></Product>
          <Product title="Casserole of mussels and scallops with saffron"><Price val={18} /></Product>
          <Product title="Trio of fresh scallops," desc="bienville style with king prawns, bechamel and mushrooms"><Price val={18} /></Product>
          <Product title="Warm toasts of brie cheese and pan-fried foie gras"><Price val={18} /></Product>
          <Product title="Land & sea plate" desc="smoked salmon and semi cooked homemade foie gras"><Price val={18} /></Product>
          <Product title="Homemade foie gras, handmade bread and fig chutney"><Price val={18} /></Product>

          <Title text="«Enfants Terribles» Main course salads" />
          <Info text="Our salads are created with the best products available on the market" />

          <Product title="L’Italienne Capricieuse" desc="Salad, tomatoes, mozzarella burratina, olives, raw ham, olive oil from Saint-Michel oil mill"><Price val={16} /></Product>
          <Product title="La Caesar like in Los Angeles" desc="Salad, tomatoes, 4 large king prawns, homemade croutons, Caesar sauce and parmesan shavings"><Price val={17} /></Product>
          <Product title="La salade du Vieux Port de Menton" desc="Salad, tomatoes, grilled peppers, cucumbers, onions, garlic and parsley potatoes, grilled tuna, boiled eggs, anchovies, olives"><Price val={17} /></Product>
          <Product title="La promenade dans le Sud-Ouest" desc="Salad, tomatoes, homemade foie gras on the baker’s toasts, duck gizzards, pine nuts, smoked breast of duck, sautéed potatoes"><Price val={19} /></Product>

          <Title text="The Pirate plate" desc="flambéed with pastis"><Price val={26} /></Title>
          <Info text="Magnificent pan-fried of king prawns with garlic and parsley, king scallops, langoustine calamari, clams razor shell, all flambéed in front of you at your table" />

          <Title text="The superb Vegan" desc="gluten free"><Price val={21} /></Title>
          <Info text="Salad, tomatoes, Provencal vegetable gratin, potatoes and parsley, Chef’s vegetables, melon, grilled peppers, mixed of raw vegetables from the market and seasonal fruit." />

          <Title text="Farandole" desc="around the sea to share... or not"><Price val={32} /></Title>
          <Info text="Smoked salmon on the baker’s toast, mussels mariniere, Italian seafood salad, warm octopus, 2 grilled kind prawn, 2 hot oysters, tuna tartare, razors shell cooked in garlic and parsley" />

          <Title text="Les Enfants terribles’s specialities" desc="Delivery from the sea" />
          <Info text="Whole fishes are cut in front of you, see availability on the board" />
          <Product title="Today’s fishing depending on delivery"><Price val={14} /></Product>
          <Product title="Wok of king scallops, vegetables and Thai noodles"><Price val={16} /></Product>
          <Product title="Red tuna steak served semi-cooked" desc="homemade mash and vegetables"><Price val={18} /></Product>
          <Product title="Filet of john Dory with potatoes and artichoke cooked in the oven"><Price val={18} /></Product>
          <Product title="« Aioli royal » with cod, king prawns, mussels, whelks and 5 vegetables" desc="served only on Friday"><Price val={22} /></Product>
          <Product title="Fry-up of calamari, crustaceans and little fishes in tempura"><Price val={22} /></Product>
          <Product title="Dover sole meuniere 400 g pan-fried with butter and parsley"><Price val={24} /></Product>
          <Product title="Tuna plate, tuna tataki and tuna tartare, homemade mash and vegetables"><Price val={25} /></Product>
          <Product title="King scallops with saffron, homemade mash and vegetables"><Price val={25} /></Product>
          <Product title="Sea bass or royal sea bream cooked in the « Ligure »"><Price text="(pour 1 personne)" val={25} /></Product>
          <Product title="style with artichokes, cherry tomatoes, olives 500g" />
          <Product title="Lobster cooked as you like it" desc="with saffron, Catalan or other recipe"><Price text="1/2 lobster" val={30} /><Price text="whole lobster" val={50} /></Product>
          <Product title="Bourride of monk fish and seabass in Marseillaise style"><Price val={35} /></Product>
          <Product title="Mediterranean turbot of 600g cooked in the oven ( for one person)"><Price val={35} /></Product>
          <Product title="Wild John Dory of 500g cooked in the oven ( for one person)"><Price val={39} /></Product>

          <Title text="Big fishes for the pleasure of sharing" />
          <Info text="Good to know : the bigger the fishes , the better they are!" />
          <Info text="MEDITERRANEAN SEABASS OR ROYAL SEA BREAM COOKED ACCORDING TO YOUR CHOICE" />
          <Info text="Ligure style » in the oven with artichokes, cherry tomatoes, olives / in salt with olive oil / grilled on the BBQ" />
          <Product title="1 kilo for 2 peoples"><Price val={58} /></Product>
          <Product title="1.5 kilos for 3 peoples"><Price val={86} /></Product>
          <Product title="2 kilos for 4 peoples"><Price val={138} /></Product>
          <Info text="63: According to delivery !" />

          <Product title="Mediterranean turbot, « ligure style » in the oven with artichokes, cherry tomatoes, olives">
            <Row><Price text="1.3 kilo for 2 peoples" val={65} /><Price text="2,6 kilos for 4 people" val={130} /></Row>
          </Product>
          <Product title="Wild John Dory « ligure style » in the oven with artichokes, cherry tomatoes, olives">
            <Row><Price text="900 g. for 2 peoples" val={70} /><Price text="1.8 kilo for 4 people" val={140} /></Row>
          </Product>
          <Product class="product-lines" title="The fishermonger’s barbecue : Mixed of fishes and seafood grilled «a la plancha»">
            <Row><Price text="served for a minimum of 2 persons (Per person)" val={35} /></Row>
          </Product>
          <Product title="The traditional Marseillaise fish soup with 5 fishes">
            <Row><Price text="(Per person)" val={38} /></Row>
            <Info text="saffron mayonnaise and garlic croutons Served for a minimum of 2 persons 30 mins wait" />
          </Product>

          <Title text="Meats and the chef’s specialities" desc="Homemade" />
          <Product title="Big Italian burger with mozzarella," desc="minced beef from the butcher, pesto, fresh tomato, parmesan cheese"><Price val={14} /></Product>
          <Product title="Spicy wok of beef with red hot pepper, vegetables and Balinese noodles"><Price val={16} /></Product>
          <Product title="Sweet and sour wok of duck with honey, vegetables and Thai noodles"><Price val={16} /></Product>
          <Product title="The « terrible » burger of foie gras," desc="minced beef from the butcher, brie cheese and smoked duck breast"><Price val={18} /></Product>
          <Product title="Pan-fried whole breast of duck with honey, vegetables of the day"><Price val={20} /></Product>
          <Product title="Beef tataki 250 g grilled on the BBQ," desc="chips, parmesan cheese, vegetables of the day, green salad"><Price text="Béarnaise sauce" val={18} /><Price text="Roquefort or pepper sauce" val={20} /></Product>
          <Product title="Roasted rack of lamb in crust of Provencal herbs, vegetables of the day"><Price val={22} /></Product>
          <Product title="Grilled beef filet with Provencal herbs"><Price val={28} /><Price text="Roquefort or pepper sauce" val={30} /></Product>
          <Product title="Beef filet « Rossini style » with foie gras and truffles"><Price val={35} /></Product>
          <Product title="The big barbecue plate" desc="served for a minimum of 2 persons only"><Price text="(Per person)" val={35} />
          <Info text="Lamb cutlets, beef skewers, duck skewers spicy sausages, chips, vegetables of the day, mixed salad and a farandole of sauces" /></Product>

          <Title text="Pastas" />
          <Product title="Vegetarian gnocchi with vegetables"><Price val={14} /></Product>
          <Product title="Gnocchi with gorgonzola and parmesan"><Price val={14} /></Product>
          <Product title="Linguini with goat’s cheese and raw ham"><Price val={14} /></Product>
          <Product title="Linguini with fresh clam’s"><Price val={16} /></Product>
          <Product title="Pappardelle with smoked salmon," desc="cherry tomatoes, fresh dill"><Price val={17} /></Product>
          <Product title="Caserecci pasta stuffed with courgettes and prawns, creamy saffron sauce"><Price val={18} /></Product>
          <Product title="Squid ink black tagliatelles" desc="octopus, mussels, calamari"><Price val={18} /></Product>
          <Product title="Large raviolis stuffed with truffles and homemade foie gras"><Price val={20} /></Product>
          <Product title="Spaghettis with crabs," desc="white wine and cherry tomatoes"><Price val={21} /></Product>
          <Product title="Linguini with mussels and scallops," desc="creamy saffron sauce"><Price val={22} /></Product>
          <Product title="Fresh tagliolinis with sea food" desc="King prawns, scallops, mussels, razors shell, langoustines, clams"><Price val={24} /></Product>
          <Product title="Fresh tagliolinis with lobster and crustacean juice"><Price val={30} /></Product>

          <Title text="Risottos" />
          <Product title="Vegetarian risotto with vegetables"><Price val={14} /></Product>
          <Product title="Risotto from Treviso, gorgonzola, goat’s and parmesan cheese"><Price val={16} /></Product>
          <Product title="Scallops and prawns risotto with saffron"><Price val={22} /></Product>
          <Product title="Sea food risotto, king prawns, scallops, mussels, razor shells, langoustines and clams"><Price val={24} /></Product>
          <Product title="Lobster risotto with crustacean juice"><Price val={30} /></Product>

          <Title text="Mussels and chips" desc="1 kilo per person" />
          <Product title="Mussels « marinière » with white wine"><Price val={16} /></Product>
          <Product title="Mussels with pesto, cream and basil"><Price val={17} /></Product>
          <Product title="Mussels «poulettes» with cream and chive"><Price val={17} /></Product>
          <Product title="Mussels « Madras » with cream and yellow curry"><Price val={17} /></Product>
          <Product title="Mussels with gorgonzola," desc="cream and parmesan cheese"><Price val={18} /></Product>
          <Product title="Mussels « bienvilles style," desc="with prawns, mushrooms, béchamel sauce"><Price val={22} /></Product>
          <Product title="Mussels « Royales »" desc="with king prawns and king scallops"><Price val={24} /></Product>

        </Carte>

        {/* <Carte header="MENUS">

          <Columns>
            <Block>

              <Title2 text="«Enfants terribles»"><Price val={10} /></Title2>
              <Product title="Welcome present" />
              <SmallLine />
              <Product title="Cheese burger chips or pasta" />
              <Product title="Carbonara pasta" />
              <Product title="Bolognese pasta" />
              <Product title="Small mussels and chips" />
              <Product title="Gnocchi with butter" />
              <Product title="Chicken nuggets chips or pasta" />
              <SmallLine />
              <Product title="Double scoop of ice-cream or fresh fruits" />

              <Line />

              <Title2 text="«Formule brasserie»"><Price val={25} /></Title2>
              <Product title="Appetizer of the day" />
              <SmallLine />
              <Product title="Grilled tuna steak and mixed vegetables" />
              <Product title="Casereccis pasta with prawns and courgettes" />
              <Product title="Italian linguini with mussels and fresh clams" />
              <Product title="Breast of duck with honey" />
              <Product title="The « terrible « burger with foie gras" />
              <Product title="Raviolis with truffles and homemade foie gras" />
              <SmallLine />
              <Product title="Expresso coffee with its avalanche of desserts" />

            </Block>
            <Block>
              <Title2 text="«Formule Express»" desc="served every day from noon to 8 pm"><Price val={17} /></Title2>
              <Product title="Today’s fishing" />
              <Product title="Fry-up of calamari, chips," desc="mixed salad and tartare sauce" />
              <Product title="Mussels mariniere 600g, chips" />
              <Product title="Beef skewer grilled with thyme" />
              <Product title="Big Italian burger with parmesan and mozzarella cheese" />
              <Product title="Grilled lamb chops" />
              <SmallLine />
              <Product title="Expresso coffee with its avalanche of desserts" />
            </Block>
          </Columns>
          <Columns>
            <Block>
              <Title2 text="«Parents terribles»"><Price val={35} /></Title2>
              <Product title="Appetizer of the day" />
              <SmallLine />
              <Product title="6 oysters « fine de claire n°2" />
              <Product title="razors shell sautéed with garlic and parsley" />
              <Product title="Prawns fritter in tempura" />
              <Product title="Homemade octopus salad" />
              <Product title="Warm goat’s cheese salad with honey" />
              <Product title="périgourdine salad” with homemade foie gras, gizzards, smoked breast of duck" />
              <SmallLine />
              <Product title="Duck breast with honey" />
              <Product title="Grilled beef filet, Provencal herbs juice" />
              <Product title="BBQ’s plate" desc="composed of beef skewer, 2 lamb chops, 2 spicy sausages, béarnaise sauce" />
              <Product title="« Aioli » with cod and king prawns with 5 vegetables" desc="Friday only" />
              <Product title="Linguini pasta with seafood" />
              <Product title="Selection of fresh fishes, ask your waiter" />
              <SmallLine />
              <Product title="Desserts menu" />
            </Block>
            <Block>
              <Title2 text="«Amants terribles»"><Price val={45} /></Title2>
              <Product title="Appetizer of the day" />
              <SmallLine />
              <Product title="6 Oysters Gillardeau N°5" />
              <Product title="King scallops bienvilles style in the oven" />
              <Product title="Tasting of 6 warm oysters" />
              <Product title="Land & sea plate with homemade foie gras and smoked salmon" />
              <Product title="Homemade foie gras and it’s fig chutney" />
              <SmallLine />
              <Product title="Beef filet Rossini style" />
              <Product title="Rack of lamb in herbs crust" />
              <Product title="King scallops with saffron" />
              <Product title="Seafood risotto" />
              <Product title="Selection of fresh fishes, ask your waiter" />
              <SmallLine />
              <Product title="Shot of liquor with sorbet" />
              <SmallLine />
              <Product title="Desserts menu" />
            </Block>
          </Columns>
        </Carte> */}

        <Info>Net prices, service included, pictures non-contractual</Info>

        <Slider>
          <Slide image="/images/tomates_mozza.jpg" title="NOTRE TOMATES MOZZA" desc="cœur de crème burrata 200 grammes" />
          <Slide image="/images/planchette_mixte.jpg" title="LA PLANCHETTE MIXTE" desc="[gendarme], jambon fumé, [chorizo], jambon du sud ouest, fuet, [munster], [ribeaupierre], brebis, cornichon, beurre, confiture cerise" />
          <Slide image="/images/tarte_chevre.jpg" title="NOS TARTES FLAMBÉES" desc="LA CHÈVRE" />
          <Slide image="/images/quiche_lorraine.jpg" title="QUICHE LORRAINE" />
          <Slide image="/images/tarte_oignon.jpg" title="LA TARTE À L’OIGNON" />
          <Slide image="/images/tartare.jpg" title="LE TARTARE DE BŒUF" />
        </Slider>
        <Languages>
          <Language lang="fr" image="/images/fr.svg" title="Français" />
          <Language lang="en" image="/images/gb.svg" title="English" />
          <Language lang="es" image="/images/es.svg" title="Español" />
          <Language lang="de" image="/images/de.svg" title="Deutsch" />
          <Language lang="zh-CN" image="/images/cn.svg" title="中国" />
        </Languages>
      </Layout>
    )
  }
}