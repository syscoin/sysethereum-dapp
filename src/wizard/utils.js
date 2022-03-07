export const getSysToSysxTx = async (thisObject) => {
  const { storedAccount, controller } = thisObject.state;

  if (!controller || !window.ConnectionsController) {
    console.error("controller not found, waiting for injection");

    return;
  }

  if (!storedAccount) {
    thisObject.setState({
      ...thisObject.state,
      storedAccount: await controller.getConnectedAccount(),
    });
  }

  const xpub = thisObject.state.storedAccount.xpub;

  const sysChangeAddress = await controller.getChangeAddress();

  if (!sysChangeAddress) {
    thisObject.setState({
      buttonVal: false,
      buttonValMsg: thisObject.props.t("step2SelectPaliAccount"),
    });

    return;
  }

  let userInput = thisObject._grabUserInput(); // grab user entered vals
  let validateNewInput = thisObject._validateData(userInput); // run the new input against the validator
  validateNewInput.buttonVal = true;
  validateNewInput.buttonValMsg = "";
  validateNewInput.txidVal = true;
  validateNewInput.txidValMsg = "";

  let valid = true;

  if (!userInput.amount || userInput.amount === "") {
    validateNewInput.amountVal = false;
    valid = false;
  }
  let self = thisObject;

  if (valid === true) {
    thisObject.setState({ working: true });

    try {
      let results = await thisObject.sysToSysX(
        userInput.amount.toString(),
        xpub,
        sysChangeAddress
      );
      if (results.error) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = results.error;
        self.setState({ working: false });
        self.setState(
          Object.assign(
            userInput,
            validateNewInput,
            thisObject._validationErrors(validateNewInput)
          )
        );
      } else if (results.txidburn) {
        validateNewInput.buttonVal = false;
        validateNewInput.txidVal = true;
        thisObject.refs.txidburn.value = results.txidburn;
        validateNewInput.buttonValMsg = "Success!";
        self.setState({ working: false });
        self.setState(
          Object.assign(
            userInput,
            validateNewInput,
            thisObject._validationErrors(validateNewInput)
          )
        );
        self.saveToLocalStorage();
      }
    } catch (e) {
      validateNewInput.buttonVal = false;
      validateNewInput.txidVal = false;
      validateNewInput.buttonValMsg =
        e && e.message ? e.message : thisObject.props.t("genericError");
      thisObject.refs.txidburn.value = "";
      self.setState({ working: false });
      self.setState(
        Object.assign(
          userInput,
          validateNewInput,
          thisObject._validationErrors(validateNewInput)
        )
      );
    }
  }
};

export const getSysToEthTx = async (thisObject) => {
  const { storedAccount, controller } = thisObject.state;

  if (!controller || !window.ConnectionsController) {
    console.error("controller not found, waiting for injection");

    return;
  }

  if (!storedAccount) {
    thisObject.setState({
      ...thisObject.state,
      storedAccount: await controller.getConnectedAccount(),
    });
  }

  const xpub = thisObject.state.storedAccount.xpub;

  const sysChangeAddress = await controller.getChangeAddress();

  if (!sysChangeAddress) {
    thisObject.setState({
      buttonVal: false,
      buttonValMsg: thisObject.props.t("step2SelectPaliAccount"),
    });

    return;
  }

  let userInput = thisObject._grabUserInput(); // grab user entered vals
  let validateNewInput = thisObject._validateData(userInput); // run the new input against the validator
  validateNewInput.buttonVal = true;
  validateNewInput.buttonValMsg = "";
  validateNewInput.txidVal = true;
  validateNewInput.txidValMsg = "";
  let valid = true;
  if (!userInput.amount || userInput.amount === "") {
    validateNewInput.amountVal = false;
    valid = false;
  }
  if (!userInput.ethaddress || userInput.ethaddress === "") {
    validateNewInput.ethaddressVal = false;
    valid = false;
  }
  let self = thisObject;

  if (valid === true) {
    thisObject.setState({ working: true });
    if (
      userInput.asset.length > 0 &&
      userInput.asset !== 0 &&
      userInput.asset !== "0"
    ) {
      let assetGuid = userInput.asset.toString();

      let ethAddressStripped = userInput.ethaddress.toString();
      if (ethAddressStripped && ethAddressStripped.startsWith("0x")) {
        ethAddressStripped = ethAddressStripped.substr(
          2,
          ethAddressStripped.length
        );
      }
      try {
        let results = await thisObject.assetBurnToEth(
          assetGuid,
          userInput.amount.toString(),
          ethAddressStripped,
          xpub,
          sysChangeAddress
        );
        if (results.error) {
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = results.error;
          self.setState({ working: false });
          self.setState(
            Object.assign(
              userInput,
              validateNewInput,
              thisObject._validationErrors(validateNewInput)
            )
          );
        } else if (results.txid) {
          validateNewInput.buttonVal = false;
          validateNewInput.txidVal = true;
          thisObject.refs.txid.value = results.txid;
          validateNewInput.buttonValMsg = "Success!";
          self.setState({ working: false });
          self.setState(
            Object.assign(
              userInput,
              validateNewInput,
              thisObject._validationErrors(validateNewInput)
            )
          );
          self.saveToLocalStorage();
        }
      } catch (e) {
        validateNewInput.txidVal = false;
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg =
          e && e.message ? e.message : thisObject.props.t("genericError");
        self.setState({ working: false });
        self.setState(
          Object.assign(
            userInput,
            validateNewInput,
            thisObject._validationErrors(validateNewInput)
          )
        );
      }
    }
  }
};

export const getSysxToSysTx = async (thisObject) => {
  const { storedAccount, controller } = thisObject.state;

  if (!controller || !window.ConnectionsController) {
    console.error("controller not found, waiting for injection");

    return;
  }

  console.log("this object get tx", thisObject);

  if (!storedAccount) {
    thisObject.setState({
      ...thisObject.state,
      storedAccount: await controller.getConnectedAccount(),
    });
  }

  const xpub = thisObject.state.storedAccount.xpub;

  const sysChangeAddress = await controller.getChangeAddress();

  if (!sysChangeAddress) {
    thisObject.setState({
      buttonVal: false,
      buttonValMsg: thisObject.props.t("step2SelectPaliAccount"),
    });

    return;
  }

  let userInput = thisObject._grabUserInput(); // grab user entered vals
  let validateNewInput = thisObject._validateData(userInput); // run the new input against the validator
  validateNewInput.buttonVal = true;
  validateNewInput.buttonValMsg = "";
  validateNewInput.txidVal = true;
  validateNewInput.txidValMsg = "";
  let valid = true;
  if (!userInput.amount || userInput.amount === "") {
    validateNewInput.amountVal = false;
    valid = false;
  }
  let self = thisObject;

  if (valid === true) {
    thisObject.setState({ working: true });

    try {
      let results = await thisObject.sysXToSys(
        userInput.amount.toString(),
        xpub,
        sysChangeAddress
      );
      if (results.error) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = results.error;
        self.setState({ working: false });
        self.setState(
          Object.assign(
            userInput,
            validateNewInput,
            thisObject._validationErrors(validateNewInput)
          )
        );
      } else if (results.txidburn) {
        validateNewInput.buttonVal = false;
        validateNewInput.txidVal = true;
        thisObject.refs.txidburn.value = results.txidburn;
        validateNewInput.buttonValMsg = "Success!";
        self.setState({ working: false });
        self.setState(
          Object.assign(
            userInput,
            validateNewInput,
            thisObject._validationErrors(validateNewInput)
          )
        );
        self.saveToLocalStorage();
      }
    } catch (e) {
      validateNewInput.buttonVal = false;
      validateNewInput.txidVal = false;
      validateNewInput.buttonValMsg =
        e && e.message ? e.message : thisObject.props.t("genericError");
      thisObject.refs.txidburn.value = "";
      self.setState({ working: false });
      self.setState(
        Object.assign(
          userInput,
          validateNewInput,
          thisObject._validationErrors(validateNewInput)
        )
      );
    }
  }
};
