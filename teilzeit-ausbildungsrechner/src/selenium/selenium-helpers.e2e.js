import { Builder, By, until } from 'selenium-webdriver';

const DEFAULT_TIMEOUT = 10_000;

/**
 * Erstellt einen Selenium WebDriver.
 * 
 * - Lokal: startet einen lokalen Chrome-Browser
 * - CI: verbindet sich mit einem Remote-Selenium-Server,
 *       falls SELENIUM_REMOTE_URL gesetzt ist
 */
export function createDriver() {
  const seleniumUrl = process.env.SELENIUM_REMOTE_URL;
  const builder = new Builder().forBrowser('chrome');

  if (seleniumUrl) {
    builder.usingServer(seleniumUrl);
  }

  return builder.build();
}

/**
 * Wartet, bis ein Element mit der gegebenen ID existiert
 * und im DOM sichtbar ist.
 * 
 * Gibt das sichtbare Element zurück.
 */
export async function waitVisibleById(driver, id, timeout = DEFAULT_TIMEOUT) {

  const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);

  return el;
}

/**
 * Schreibt einen numerischen Wert in ein Input-Feld.
 * 
 * Das Feld wird vorher geleert, um alte Werte zu entfernen.
 */
export async function typeNumberById(driver, id, value, timeout = DEFAULT_TIMEOUT) {
  const el = await waitVisibleById(driver, id, timeout);
  await el.clear();
  await el.sendKeys(String(value));
}

/**
 * Klickt einen Radio-Button anhand von name und value.
 * 
 * Da die Radio-Inputs im UI oft per CSS versteckt sind,
 * wird der Klick bewusst per JavaScript ausgeführt.
 */
export async function clickRadioByNameAndValue(
  driver,
  name,
  value,
  timeout = DEFAULT_TIMEOUT
) {
  const selector = `input[name="${name}"][value="${value}"]`;
  const radio = await driver.wait(
    until.elementLocated(By.css(selector)),
    timeout
  );

  await driver.executeScript('arguments[0].click();', radio);
}

/**
 * Klickt einen Button anhand seiner ID.
 * 
 * Der Button wird zuerst in den sichtbaren Bereich gescrollt,
 * um ElementClickInterceptedError zu vermeiden.
 */
export async function clickButtonById(driver, id, timeout = DEFAULT_TIMEOUT) {
  const el = await waitVisibleById(driver, id, timeout);

  await driver.executeScript(
    'arguments[0].scrollIntoView({ block: "center" });',
    el
  );

  await driver.sleep(200);

  await driver.executeScript('arguments[0].click();', el);
}
