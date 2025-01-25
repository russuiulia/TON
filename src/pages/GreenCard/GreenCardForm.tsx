import {
  Cell,
  Select,
  Modal,
  Placeholder,
  List,
  FixedLayout,
  Banner,
  Button,
  Radio,
  Input,
  Section,
} from '@telegram-apps/telegram-ui';
import {
  isNumeric,
  validateIDNO,
  validateIDNP,
  formatDateForAPI,
  getNextTenDaysForAPI,
  getNextTenDays,
} from './constants';
import { useEffect, useState } from 'react';
import { getOffers } from '../../api/getOffers';
import { Offer } from '../../interfaces/offer';
import {
  capitalizeFirstLetter,
  formatDateRange,
  isValidDate,
} from '../../utils/shared';
import { createOrder } from '../../api/createOrder';
import { DateInput } from '../../components/shared/DateInput';
import { sendPreorderToChat } from '../../api/sendPreorderToChat copy';
import { useLanguage } from '../../LanguageProvider';
import {
  initHapticFeedback,
  // initBackButton,
  useInitData,
} from '@tma.js/sdk-react';
const initialFormData = {
  region: '',
  idnx: '',
  certificateNumber: '',
  duration: '15',
  startDate: getNextTenDaysForAPI()[0],
  startDateData: '',
  company: '',
};

export const GreenCardForm = () => {
  const { translate, language } = useLanguage();
  const HapticFeedback = initHapticFeedback();
  // const BackButton = initBackButton();
  const initData = useInitData();

  const [buttonText, setButtonText] = useState(translate('calculate'));
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
  const [isConfirmButtonLoading, setConfirmButtonLoading] = useState(false);
  const [isDateInputValid, setIsDateInputValid] = useState(true);
  const [isFinalDateValid, setIsFinalDateValid] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [offers, setOffers] = useState<{ offers: Offer[] }>({ offers: [] });
  const [idnxStatus, setIdnxStatus] = useState<
    'default' | 'error' | 'focused' | undefined
  >('default');
  const [certificateNumberStatus, setCertificateNumberStatus] = useState<
    'default' | 'error' | 'focused' | undefined
  >('default');
  const [idnxErrorMessage, setIdnxErrorMessage] = useState('');
  const [carSummary, setCarSummary] = useState('');
  // const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [isChanged, setIsChanged] = useState(false);
  console.log(idnxErrorMessage, isChanged);
  useEffect(() => {
    setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData));
  }, [formData]);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // useEffect(() => {
  //   const handleBackClick = () => {
  //     if (isChanged) {
  //       window!.Telegram!.WebApp.showConfirm(
  //         translate('alert-unsaved-changes'),
  //         (confirmed) => {
  //           if (confirmed) {
  //             window.location.href = '/';
  //           }
  //         }
  //       );
  //     } else {
  //       window.location.href = '/';
  //     }
  //   };

  //   window!.Telegram!.WebApp.BackButton.onClick(handleBackClick);

  //   return () => {
  //     window!.Telegram!.WebApp.BackButton.offClick(handleBackClick);
  //   };
  // }, [isChanged, translate]);

  const validateIdnx = (e: any) => {
    const isIdno = validateIDNO(e.target.value);
    const isIdnp = validateIDNP(e.target.value);
    if (isIdno || isIdnp) {
      setIdnxStatus('default');
      setIdnxErrorMessage('');
    } else {
      setIdnxStatus('error');
    }
    if (e.target.value.length === 13) {
      if (!isIdno && !isIdnp) {
        HapticFeedback.notificationOccurred('error');
      }
    }
  };

  const validateCertificateNumber = (e: any) => {
    const certificateNumber = e.target.value;
    if (
      certificateNumber.toString().length === 9 &&
      isNumeric(certificateNumber)
    ) {
      setCertificateNumberStatus('default');
    } else {
      setCertificateNumberStatus('error');
    }
  };

  useEffect(() => {
    const isValid = isValidDate(formData.startDateData);
    setIsDateInputValid(isValid);
    if (formData.startDate === 'otherday' && isDateInputValid) {
      setIsFinalDateValid(true);
    } else if (getNextTenDaysForAPI().includes(formData.startDate)) {
      setIsFinalDateValid(true);
    } else setIsFinalDateValid(false);
  }, [formData.startDate, formData.startDateData, isDateInputValid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      (formData.region === 'UA' || formData.region === 'EU') &&
      formData.duration.length !== 0 &&
      formData.certificateNumber.length !== 0 &&
      formData.idnx.length !== 0 &&
      certificateNumberStatus !== 'error' &&
      idnxStatus !== 'error' &&
      isFinalDateValid
    ) {
      setButtonDisabled(true);
      setButtonLoading(true);
      getOffers(
        formData.certificateNumber,
        parseInt(formData.duration),
        formData.region,
        formData.idnx
      ).then((res) => {
        if (res.hasOwnProperty('error')) {
          setButtonLoading(false);
          if (res.error === 'Vehicle not found') {
            setCertificateNumberStatus('error');
            HapticFeedback.notificationOccurred('error');
          }
          return;
        }
        const lowestPriceOffer = res.offers.reduce(
          (minOffer: any, currentOffer: any) => {
            return currentOffer.price < minOffer.price
              ? currentOffer
              : minOffer;
          }
        );
        setButtonText(
          `${res.offers.length} ${translate('offers-from')} ${
            lowestPriceOffer.price
          } ${lowestPriceOffer.currency})`
        );
        HapticFeedback.notificationOccurred('success');
        setOffers(res);
        setButtonLoading(false);
        setButtonDisabled(false);
      });
    } else {
      setButtonText(translate('calculate'));
      setButtonDisabled(true);
      setButtonLoading(false);
      setConfirmButtonDisabled(true);
    }
  }, [
    formData.certificateNumber,
    formData.duration,
    formData.idnx,
    formData.region,
    formData.startDate,
    formData.startDateData,
    isDateInputValid,
    certificateNumberStatus,
    idnxStatus,
    isFinalDateValid,
    translate,
  ]);

  useEffect(() => {
    setFormData({
      ...formData,
      company: '',
    });
    setConfirmButtonDisabled(true);
    const carInfo = offers?.offers[0]?.name.split(', ').pop() || '';
    setCarSummary(carInfo);
  }, [offers]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (formData.company !== '') {
      setConfirmButtonDisabled(false);
    } else {
      setConfirmButtonDisabled(true);
    }
  }, [formData.company]);
  const handleSubmit = () => {
    try {
      const { certificateNumber, region, duration, startDate, idnx, company } =
        formData;
      setConfirmButtonLoading(true);
      setConfirmButtonDisabled(true);
      const date =
        startDate === 'otherday'
          ? formatDateForAPI(formData.startDateData)
          : startDate;
      createOrder(
        date,
        certificateNumber,
        parseInt(duration),
        region,
        idnx,
        company,
        initData!.user!.id
      ).then((res) => {
        HapticFeedback.notificationOccurred('success');
        // sendMessageToChat(
        //   window.Telegram?.WebApp.initDataUnsafe.user?.id.toString(),
        //   `Comanda Asigurare Carte Verde ${res.id} a fost creatǎ: https://iasig-telegram.pages.dev/order?order=${res.id}`
        // );
        sendPreorderToChat(
          initData!.user!.id.toString(),
          `${translate('green-card-with')}${res.id} ${translate(
            'green-card-was-created'
          )}`,
          translate('view-order'),
          res.id,
          `${process.env.REACT_APP_URL}/order?order=${res.id}`
        );
        window!.location!.href = `/order?order=${res.id}`;
      });
    } catch (err) {
      setConfirmButtonLoading(false);
    }
  };

  const GreenCardOptions = [
    { value: '15', title: translate('duration-15-days') },
    { value: '30', title: translate('duration-1-month') },
    { value: '60', title: translate('duration-2-months') },
    { value: '90', title: translate('duration-3-months') },
    { value: '120', title: translate('duration-4-months') },
    { value: '150', title: translate('duration-5-months') },
    { value: '180', title: translate('duration-6-months') },
    { value: '210', title: translate('duration-7-months') },
    { value: '240', title: translate('duration-8-months') },
    { value: '270', title: translate('duration-9-months') },
    { value: '300', title: translate('duration-10-months') },
    { value: '330', title: translate('duration-11-months') },
    { value: '365', title: translate('duration-12-months') },
  ];

  //button logic
  // useEffect(() => {
  //   const mainButton = window!.Telegram!.WebApp.MainButton;

  //   mainButton.isVisible = true;
  //   mainButton.setText(buttonText);

  //   const handleClick = () => setIsOffersModalOpen(true);
  //   const handleOffClick = () => setIsOffersModalOpen(false);

  //   mainButton.onClick(handleClick);
  //   mainButton.offClick(handleOffClick);

  //   return () => {
  //     mainButton.offClick(handleClick);
  //     mainButton.offClick(handleOffClick);
  //   };
  // }, [buttonText]);

  // useEffect(() => {}, [buttonText]);
  return (
    <form className="w-full" style={{ marginTop: '5rem' }}>
      <List
        style={{
          background: 'var(--tgui--secondary_bg_color)',
          height: '100%',
        }}
      >
        <Section
          header={translate('green-card-form:region-label')}
          className="pt-4 mt-12 "
        >
          <Cell
            Component="label"
            before={
              <Radio
                name="region"
                value="UA"
                onChange={(e) => {
                  handleChange(e);
                  HapticFeedback.impactOccurred('light');
                }}
              />
            }
            multiline
          >
            {translate('green-card-form:region-ua')}
          </Cell>
          <Cell
            Component="label"
            before={
              <Radio
                name="region"
                value="EU"
                onChange={(e) => {
                  handleChange(e);
                  HapticFeedback.impactOccurred('light');
                }}
              />
            }
            multiline
          >
            {translate('green-card-form:region-eu')}
          </Cell>
        </Section>
        <Section header={translate('green-card-form:insurance-period')}>
          <Select
            name="duration"
            value={formData.duration}
            onChange={(e) => {
              handleChange(e);
              HapticFeedback.impactOccurred('light');
            }}
          >
            {GreenCardOptions.map((val) => {
              return (
                <option value={val.value} key={val.value}>
                  {val.title}
                </option>
              );
            })}
          </Select>
        </Section>
        <Section header={translate('green-card-form:start-date')}>
          <Select
            name="startDate"
            value={formData.startDate}
            onChange={(e) => {
              handleChange(e);
              HapticFeedback.impactOccurred('light');
            }}
          >
            <option value={getNextTenDaysForAPI()[0]}>
              {translate('today')} ({getNextTenDays()[0]})
            </option>
            <option value={getNextTenDaysForAPI()[1]}>
              {translate('tomorrow')} ({getNextTenDays()[1]})
            </option>
            <option value={getNextTenDaysForAPI()[2]}>
              {translate('day-after-tomorrow')} ({getNextTenDays()[2]})
            </option>
            <option value={getNextTenDaysForAPI()[3]}>
              {`${getNextTenDays()[3]}`}
            </option>
            <option value={getNextTenDaysForAPI()[4]}>
              {`${getNextTenDays()[4]}`}
            </option>
            <option value={getNextTenDaysForAPI()[5]}>
              {`${getNextTenDays()[5]}`}
            </option>
            <option value={getNextTenDaysForAPI()[6]}>
              {`${getNextTenDays()[6]}`}
            </option>
            <option value={getNextTenDaysForAPI()[7]}>
              {`${getNextTenDays()[7]}`}
            </option>
            <option value={getNextTenDaysForAPI()[8]}>
              {`${getNextTenDays()[8]}`}
            </option>{' '}
            <option value={getNextTenDaysForAPI()[9]}>
              {`${getNextTenDays()[9]}`}
            </option>
            {/* <option value="otherday">Altǎ zi ...</option> */}
          </Select>
        </Section>
        {formData.startDate === 'otherday' && (
          <DateInput
            name="startDateData"
            value={formData.startDateData}
            isValid={isDateInputValid}
            onChange={(e: any) => {
              handleChange(e);
            }}
          />
        )}
        <Section header={translate('green-card-form:certificate-number')}>
          <Input
            placeholder="200200200"
            type="text"
            inputMode="numeric"
            maxLength={9}
            name="certificateNumber"
            value={formData.certificateNumber}
            status={certificateNumberStatus}
            onChange={(e) => {
              handleChange(e);
              validateCertificateNumber(e);
            }}
          />
        </Section>
        <Section header={translate('green-card-form:idnp-idno')}>
          <Input
            placeholder="2000400070720"
            name="idnx"
            type="text"
            inputMode="numeric"
            maxLength={13}
            status={idnxStatus}
            value={formData.idnx}
            onChange={(e) => {
              handleChange(e);
              validateIdnx(e);
            }}
          />
        </Section>
        <div
          style={{
            height: '70px',
            backgroundColor: 'var(--tgui--secondary_bg_color)',
          }}
        ></div>
        <Modal
          header={<Modal.Header />}
          trigger={
            <FixedLayout
              style={{
                padding: 16,
                backgroundColor: 'var(--tgui--secondary_bg_color)',
              }}
            >
              <Button
                size="m"
                stretched
                disabled={isButtonDisabled}
                loading={isButtonLoading}
              >
                {buttonText}
              </Button>
            </FixedLayout>
          }
        >
          <Placeholder style={{ padding: '0px', alignItems: 'start' }}>
            <List
              style={{
                margin: '0',
                marginLeft: '4px',
              }}
            >
              <Banner
                className="w-full"
                //@ts-ignore
                callout={translate('green-card-form:vehicle')}
                header={carSummary}
                style={{
                  margin: '0',
                  paddingBottom: '0',
                  boxShadow: 'none ',
                  boxSizing: 'content-box',
                }}
              ></Banner>
              <Banner
                className="w-full"
                //@ts-ignore
                callout={translate('green-card-form:insurance-period-summary')}
                header={formatDateRange(
                  formData.startDate,
                  formData.duration,
                  formData.startDateData,
                  isDateInputValid,
                  language
                )}
                style={{
                  margin: '0',
                  paddingBottom: '0',
                  boxSizing: 'content-box',
                  boxShadow: 'none ',
                }}
              ></Banner>
              <Banner
                className="w-full"
                //@ts-ignore
                callout={translate('green-card-form:region-summary')}
                header={
                  formData.region === 'UA'
                    ? translate('green-card-form:region-ua')
                    : formData.region === 'EU'
                    ? translate('green-card-form:region-eu')
                    : ''
                }
                style={{
                  // margin: '0',
                  paddingBottom: '15px',
                  boxSizing: 'content-box',
                  boxShadow: 'none ',
                }}
              ></Banner>
            </List>
            <Section
              header={translate('green-card-form:insurance-company')}
              className="p-0 w-full"
            >
              {offers.offers.map((offer: Offer) => {
                return (
                  <Cell
                    className="w-full"
                    Component="label"
                    before={
                      <>
                        <Radio
                          name="company"
                          value={offer.company}
                          checked={formData.company === offer.company}
                          onChange={(e) => {
                            handleChange(e);
                            HapticFeedback.impactOccurred('light');
                          }}
                        />
                        <img
                          className="ml-3"
                          width={40}
                          src={`./images/${capitalizeFirstLetter(
                            offer.company
                          )}.png`}
                          alt={capitalizeFirstLetter(offer.company)}
                        />
                      </>
                    }
                    multiline
                    after={
                      <small className="max-w-[100px] text-center">
                        <b>{offer.price} MDL</b>
                        <div className="opacity-80">
                          ({offer.reference_price.replace(' EUR', '')} €)
                        </div>
                      </small>
                    }
                  >
                    {capitalizeFirstLetter(offer.company)}
                  </Cell>
                );
              })}
            </Section>
            <div className="p-[16px] w-full">
              <Button
                size="m"
                stretched
                type="submit"
                onClick={handleSubmit}
                disabled={isConfirmButtonDisabled}
                loading={isConfirmButtonLoading}
              >
                {translate('green-card-form:submit-button')}
              </Button>
            </div>
          </Placeholder>
        </Modal>
      </List>
    </form>
  );
};
