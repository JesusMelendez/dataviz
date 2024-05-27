

am4core.options.autoDispose = true;

const t7 = './js/t7.json';

/****  main functions *****/

//fetch
async function getJson7(liga){
    let response = await fetch(liga);
    let datos = await response.json();
    return datos;
};

function arregloYears7(arregloUnido){
    let x = [];
    arregloUnido.map(function(obj){
  
       x = x.concat(obj.TIME_PERIOD);
    })
    let unicos = Array.from(new Set(x))
    return unicos;
  }
  
function crearOpciones7(arregloYear,Dropdown){

for (let i = 0; i < arregloYear.length; i++){
    let year = arregloYear[i];
    let option = document.createElement('option');
    option.textContent = year;
    option.value=year;
    Dropdown.appendChild(option);

    }

}

function barchart(containerName,dataSet,dataSetBase,categoryAxisName,valueAxisName,selectID){

  let grafica_1 = containerName.createChild(am4charts.XYChart);
  grafica_1.paddingRight = 0;

  grafica_1.data = dataSetBase;
      
  
    
  
    grafica_1.colors.list = [
      am4core.color("#539b9d"),
      am4core.color("#72a1c6"),
      am4core.color("#927def"),
      am4core.color("#f9d5a5"),
      am4core.color("#9a3671")
    ];
  
    // Create axes
    let categoryAxis = grafica_1.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = `${categoryAxisName}`;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.endLocation = 1;
    categoryAxis.renderer.labels.template.fontSize = 12;
  

    
    let  valueAxis1 = grafica_1.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = `[font-size:12px] ${valueAxisName}`;
    valueAxis1.min = 0;
    valueAxis1.tooltip.disabled = false;
    valueAxis1.renderer.grid.template.disabled = false;
    
    // Create series
    function createSeries(field, name) {
  
  
      // Set up series
      let series = grafica_1.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = `${categoryAxisName}`;
      series.sequencedInterpolation = true;
      
      // Make it stacked
      series.stacked = false;
      series.columns.template.width = am4core.percent(40);
      series.tooltipHTML = "<span style='font-size:12px; color:#000000;'><b>{valueY.value}</b></span>";
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color("#FFF");
  
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.background.strokeWidth = 3;
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.dy = -10;
      labelBullet.label.text = "[font-size:0.85rem]{valueY} ";
  
      return series;
    }
  
    
    createSeries("inno", "Innovation");
    createSeries("cg", "Benchmark")
  
  
    
    grafica_1.cursor = new am4charts.XYCursor();
    // Legend
    grafica_1.legend = new am4charts.Legend();
    grafica_1.legend.fontSize = 12;
    grafica_1.legend.position = "right";
    grafica_1.maskBullets = false;
  

    let years = arregloYears7(dataSet);
    let dropdown =  document.getElementById(`${selectID}`);
    crearOpciones7(years,dropdown);

  
    dropdown.addEventListener('change', function() {
    let result_actual = dataSet.find(({ TIME_PERIOD }) => TIME_PERIOD === this.value);
      result_actual_selected = result_actual.RESULTS;
      grafica_1.data = result_actual_selected;
    });
}

async function greenhouse(){
  
  //get data

  let API_NRC = await getJson7(t7);
  let water_prod_set = API_NRC.KPI_SET[0].OBSERVATIONS;
  let water_prod_base = water_prod_set[0].RESULTS;

  //set container

  let benchContainer = am4core.create('CO2',am4core.Container)
  benchContainer.logo.disabled= true
  benchContainer.width = am4core.percent(100);
  benchContainer.height = am4core.percent(100);
  benchContainer.layout = "horizontal";

  //initial graph
barchart(benchContainer,water_prod_set,water_prod_base,'variedad','Kilograms of carbon dioxide per hectare','test_select');

  
  const switchButton = document.getElementById('swith_t7');

  const select =  document.getElementById('test_select')

  const selectbenchmark =  document.getElementById('bech_select')

  //events
  switchButton.addEventListener('change', () => {
    if (switchButton.checked) {
      //seteo inicial 
      try{
        select.options.length = 0;
        selectbenchmark.options.length = 0;
        selectbenchmark.removeAttribute("disabled");
        benchContainer.disposeChildren()

      }
      catch(err){
        console.log(err)
      }
      barchart(benchContainer,water_prod_set,water_prod_base,'variedad','Kilograms of carbon dioxide per hectare','test_select');
      let graph_2=barchart(benchContainer,water_prod_set,water_prod_base,'variedad','Kilograms of carbon dioxide per hectare','bech_select');
    } 
    else 
    {
      try{
        select.options.length = 0;
        selectbenchmark.options.length = 0;
        selectbenchmark.removeAttribute("disabled");
        benchContainer.disposeChildren()
      }      
      catch(err){
        console.log(err)
      }
      finally{
        const opt = document.createElement("option");
        opt.value = "1";
        opt.text = "Only bechmark active";
        selectbenchmark.setAttribute("disabled", "");
        selectbenchmark.add(opt, selectbenchmark.options[0]);
        barchart(benchContainer,water_prod_set,water_prod_base,'variedad','Kilograms of carbon dioxide per hectare','test_select');
      }

      
    }
  });

};


greenhouse();