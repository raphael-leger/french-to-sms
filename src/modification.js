const disabledModifications = [];

const disableModification = (input) => {
  const modificationNumber = disabledModifications.length + 1;
  const hash = `!!!!!!FRENCH!TO!SMS!REPLACEMENT!${modificationNumber}`;

  disabledModifications.push({
    input,
    hash
  });

  return hash;
};

const enableModification = (input) => {
  const disabledModificationIndex = disabledModifications.findIndex(modification => modification.input === input);
  if (disabledModificationIndex > -1) {
    const { hash } = disabledModifications[disabledModificationIndex];
    disabledModifications.splice(disabledModificationIndex, 1);
    return hash;
  };

  throw Error(`Can not enable modification on the string "${input}" as it has not been disabled.`);
};

module.exports = { disableModification, enableModification };
