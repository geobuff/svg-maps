# geobuff/svg-maps
[![npm](https://img.shields.io/npm/v/@geobuff/svg-maps)](https://www.npmjs.com/package/@geobuff/svg-maps)
[![David](https://img.shields.io/david/geobuff/svg-maps)](https://david-dm.org/geobuff/svg-maps)

A collection of free-to-use maps.

## Install
```
npm install @geobuff/svg-maps 
```

## Usage
```
import React from "react";
import { SVGMap } from "@geobuff/svg-map";
import { WorldCountries } from "@geobuff/svg-maps";

const ExampleComponent = () => (
  <>
    <SVGMap map={WorldCountries} />
  </>
);

export default ExampleComponent;
```

## Available Maps

| Name | Class |
| --- | --- |
| World, Countries| WorldCountries |
| World, Capitals | WorldCapitals |
| Africa, Countries | AfricaCountries |
| Asia, Countries | AsiaCountries |
| Europe, Countries | EuropeCountries | 
| North America, Countries | NorthAmericaCountries |
| South America, Countries | SouthAmericaCountries |
| Oceania, Countries | OceaniaCountries |
| Argentina, Provinces | ArgentinaProvinces |
| Australia, States and Territories | AustraliaStatesAndTerritories |
| Brazil, States | BrazilStates |
| Canada, Provinces and Territories | CanadaProvincesAndTerritories |	
| France, Regions | FranceRegions |
| Germany, States | GermanyStates |
| India, States and Union Territories | IndiaStatesAndUnionTerritories |
| Japan, Prefectures | JapanPrefectures |
| Mexico, States | MexicoStates |
| New Zealand, Regions | New ZealandRegions |
| Nigeria, States | NigeriaStates |
| Turkey, Provinces | TurkeyProvinces |
| US, States | UsStates |
| Uganda, Districts | UgandaDistricts |
| Zambia, Provinces | ZambiaProvinces |
