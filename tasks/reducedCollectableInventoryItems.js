/* eslint-disable no-param-reassign */
const _ = require('lodash');

const definitions = require('../definitions');
const fileManager = require('../fileManager');
const { openJSON } = require('../utils');

const ITEM_CATEGORY_HASHES = [
  1, // Weapon
  18, // Currencies
  19, // Emblems
  20, // Armor
  34, // Engrams
  35, // Consumables
  40, // Materials
  41, // Shaders
  42, // Ships
  43, // Sparrows
  44, // Emotes
  54, // Sword
  55, // Mask
  57, // Aura
  59, // Mods
  // 52: Inventory
  // - 19: Emblems
  // - 41: Shaders
  // - 42: Ships
  // - 43: Sparrows
  // - 18: Currencies
  // - 40: Materials
  // - 35: Consumables
  // - 50: Subclasses
  // - 56: Mods
  // - 58: Clan Banner
];

const ITEM_PROPERTIES = [
  'hash',
  'itemTypeName',
  'screenshot',
  'itemTypeDisplayName',
  'vendorIdentifier',
  'classType',
  'itemCategoryHashes',
  'displayProperties.name',
  'displayProperties.description',
  'displayProperties.icon',
  'inventory.tierTypeName',
  'inventory.tierTypeHash',
  'inventory.stackUniqueLabel',
  'plug.plugCategoryIdentifier',
];

function processItems(allItems, lang) {
  const items = _(allItems)
    .toPairs()
    .filter(([itemHash, item]) => {
      const intersected = _.intersection(
        item.itemCategoryHashes,
        ITEM_CATEGORY_HASHES,
      ).length;
      const include = !!intersected;

      return include;
    })
    .map(([itemHash, item]) => {
      const payload = [itemHash, _.pick(item, ITEM_PROPERTIES)];
      console.log(payload);
      return payload;
    })
    .fromPairs()
    .value();

  console.log('saving:', items);

  return fileManager.saveFile(
    [lang, 'reducedCollectableInventoryItems.json'],
    items,
  );
}

module.exports = function createItemDumps(pathPrefix, lang) {
  return openJSON(`${pathPrefix}/raw/DestinyInventoryItemDefinition.json`).then(
    items => processItems(items, lang),
  );
};