import {
  Banner,
  Button,
  FixedLayout,
  List,
  Modal,
  Section,
  Skeleton,
  Spinner,
} from '@telegram-apps/telegram-ui';
import { TelegramTitle } from '../../components/shared/TelegramTitle';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getOrder } from '../../api/getOrder';
import { InsuranceType } from '../../interfaces/offer';
import { OrderStatus } from './OrderStatus';
// import { sendDocumentToChat } from '../../api/sendDocumentInChat';
import { useLanguage } from '../../LanguageProvider';

export const OrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicle, setVehicle] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [region, setRegion] = useState('');
  const [file, setFile] = useState('');
  const [insuranceDescription, setInsuranceDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('');
  const [isPaymentDisabled, setIsPaymentDisabled] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [insuranceType, setInsuranceType] = useState('');
  // const [openModal, setOpenModal] = useState(false);
  const { translate, language } = useLanguage();

  const orderParam = searchParams.get('order');
  console.log(setSearchParams);
  useEffect(() => {
    document.title = `${language === 'ru' ? 'Заказ' : 'Comanda'} ${orderParam}`;
  }, [orderParam, language]);

  const prevStatusRef = useRef(null);

  useEffect(() => {
    let interval: any;

    const fetchOrderData = async () => {
      try {
        if (orderParam) {
          const res = await getOrder(orderParam);
          if (res.hasOwnProperty('error')) {
            setNotFound(true);
            return;
          }
          setNotFound(false);

          const info = res.description.split(', ');
          const carInfo = info.pop() || '';
          setVehicle(carInfo);
          setDuration(info[1]);
          setRegion(info[2]);
          setInsuranceDescription(info[0]);
          setPrice(res.price);
          setCurrency(res.currency);
          setIsPaymentDisabled(false);
          setStatus(res.status);
          if (res.products?.length > 0) {
            setFile(res.products[0].file);
          }
          const orderTypeID = orderParam.slice(0, 3);

          if (language === 'ru') {
            const ruDuration = info[1]
              .replace(/zile/g, 'дней')
              .replace(/luna/g, 'месяц')
              .replace(/luni/g, 'месяца');
            setDuration(ruDuration);
            setRegion(
              info[2] === 'Europa'
                ? 'Европа'
                : info[2] === 'Ucraina'
                ? 'Украина'
                : info[2]
            );
            if (
              InsuranceType[orderTypeID as keyof typeof InsuranceType] ===
              'green-card'
            ) {
              setInsuranceDescription('Зеленая карта');
            }
          }
          setIsLoaded(true);
          setInsuranceType(
            InsuranceType[orderTypeID as keyof typeof InsuranceType]
          );
          if (res.status === 'completed') {
            const completedInfo = info[0].split(' - ');
            setVehicle(
              `${res.products[0].car_model} ${res.products[0].plate_number}`
            );
            setDuration(completedInfo[1]);
            setRegion(info[1]);
            setInsuranceDescription(completedInfo[0]);
            setPrice(res.price);
            setCurrency(res.currency);
            setIsPaymentDisabled(false);
            setStatus(res.status);
            if (language === 'ru') {
              const ruDuration = completedInfo[1]
                .replace(/zile/g, 'дней')
                .replace(/luna/g, 'месяц')
                .replace(/luni/g, 'месяца');
              setRegion(
                info[1] === 'Europa'
                  ? 'Европа'
                  : info[1] === 'Ucraina'
                  ? 'Украина'
                  : info[1]
              );
              setDuration(ruDuration);
              if (
                InsuranceType[orderTypeID as keyof typeof InsuranceType] ===
                'green-card'
              ) {
                setInsuranceDescription('Зеленая карта');
              }
            }
          }
          if (
            prevStatusRef.current !== 'completed' &&
            res.status === 'completed'
          ) {
            // if (window.Telegram && window.Telegram.WebApp) {
            //   const initDataUnsafe = window.Telegram?.WebApp.initDataUnsafe;
            //   if (initDataUnsafe && initDataUnsafe.user) {
            //     window!.Telegram!.WebApp.HapticFeedback.notificationOccurred(
            //       'success'
            //     );
            //     const messageText =
            //       language === 'ru'
            //         ? `Ваш заказ ${insuranceDescription} - ${duration} ${res.products[0].car_model} ${res.products[0].plate_number} с номером ${orderParam} готов`
            //         : `Comanda dvs. ${info[0]} ${res.products[0].car_model} ${res.products[0].plate_number} cu nr.${orderParam} este procesatǎ`;
            //     sendDocumentToChat(
            //       initDataUnsafe.user.id.toString(),
            //       res.products[0].file,
            //       messageText
            //     );
            //   } else {
            //     window!.Telegram!.WebApp.HapticFeedback.notificationOccurred(
            //       'error'
            //     );
            //     console.error('User data is unavailable.');
            //   }
            // } else {
            //   console.error('Telegram WebApp is not initialized.');
            // }
          }
          // if (prevStatusRef.current !== 'failed' && res.status === 'failed') {
          //   window!.Telegram!.WebApp.HapticFeedback.notificationOccurred(
          //     'error'
          //   );
          // }

          prevStatusRef.current = res.status;
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    if (orderParam) {
      fetchOrderData();
      interval = setInterval(fetchOrderData, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [orderParam, language, duration, insuranceDescription]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  if (notFound) {
    return (
      <>
        <div
          style={{
            backgroundColor: 'var(--tgui--secondary_bg_color)',
            height: '100%',
          }}
        >
          <TelegramTitle
            title={translate('order-not-found:title')}
            subtitle={'order-not-found:subtitle'}
          />
          <FixedLayout
            style={{
              padding: 16,
              backgroundColor: 'var(--tgui--secondary_bg_color)',
            }}
          >
            <Button
              size="m"
              stretched
              onClick={() => {
                window.location.href = '/';
              }}
            >
              {translate('order-not-found:button')}
            </Button>
          </FixedLayout>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          background: 'var(--tgui--secondary_bg_color)',
          height: '100%',
        }}
      >
        <TelegramTitle title={orderParam} />
        <OrderStatus orderStatus={status} />
        {(status === 'paid' ||
          status === 'processing' ||
          status === 'issued') && (
          <div>
            <Spinner size="l" className="flex justify-center" />
          </div>
        )}
        <div>
          <Section
            header={translate('order:order-details-label')}
            className="p-0 w-full  pt-12"
            style={{
              background: 'var(--tgui--secondary_bg_color)',
              padding: '10px',
              // marginBottom:'60px'
            }}
          >
            <List>
              <Skeleton visible={!isLoaded}>
                <Banner
                  className="w-full"
                  callout={translate('order:order-type-label')}
                  header={insuranceDescription}
                  style={{
                    margin: '0',
                    paddingBottom: '0',
                  }}
                ></Banner>
                <Banner
                  className="w-full"
                  callout={translate('order:vehicle-label')}
                  header={vehicle}
                  style={{
                    margin: '0',
                    paddingBottom: '0',
                  }}
                ></Banner>
                <Banner
                  className="w-full"
                  callout={translate('order:duration-label')}
                  header={duration}
                  style={{
                    margin: '0',
                    paddingBottom: '0',
                  }}
                ></Banner>
                <Banner
                  className="w-full"
                  callout={translate('order:region-label')}
                  header={region}
                  style={{
                    margin: '0',
                    // paddingBottom: '0',
                  }}
                ></Banner>
              </Skeleton>{' '}
            </List>
            <div
              style={{
                height: '70px',
                backgroundColor: 'var(--tgui--secondary_bg_color)',
              }}
            ></div>
            {status === 'draft' && (
              <Modal
                style={{
                  height: '100%',
                }}
                header={<Modal.Header />}
                trigger={
                  <FixedLayout
                    style={{
                      zIndex: 1,
                      padding: 16,
                      backgroundColor: 'var(--tgui--secondary_bg_color)',
                    }}
                  >
                    <Button
                      size="m"
                      stretched
                      loading={!isLoaded}
                      disabled={isPaymentDisabled}
                    >
                      {`${translate('order:pay')} (${price} ${currency})`}
                    </Button>
                  </FixedLayout>
                }
              >
                <div className="h-[100vh]">
                  <div
                    style={{
                      margin: 'auto',
                      height: '100%',
                      width: '100%',
                      top: '50%',
                      left: '45%',
                      zIndex: '2',
                      position: 'absolute',
                    }}
                  >
                    <Spinner size="l" />
                  </div>

                  <iframe
                    title="payment"
                    ref={iframeRef}
                    src={`${process.env.REACT_APP_NEXT_PUBLIC_HOST_FUNCTION}/maibData?language=${language}&orderId=${orderParam}&insuranceType=${insuranceType}&isTelegram=true`}
                    style={{
                      width: '100%',
                      height: '100%',
                      zIndex: '3',
                      position: 'relative',
                    }}
                  />
                </div>
              </Modal>
            )}
            {/* {(status === 'issued' ||
              status === 'paid' ||
              status === 'processing') && (
              <FixedLayout
                style={{
                  zIndex: 1,
                  padding: 16,
                  backgroundColor: 'var(--tgui--secondary_bg_color)',
                }}
              >
                <Button
                  size="l"
                  stretched
                  loading={true}
                  disabled={true}
                ></Button>
              </FixedLayout>
            )} */}
            {(status === 'expired' ||
              status === 'failed' ||
              status === 'refunded') && (
              <FixedLayout
                style={{
                  zIndex: 1,
                  padding: 16,
                  backgroundColor: 'var(--tgui--secondary_bg_color)',
                }}
              >
                <Link to={'/'}>
                  <Button
                    size="m"
                    stretched
                    loading={!isLoaded}
                    disabled={isPaymentDisabled}
                  >
                    {translate('order:make-new')}
                  </Button>
                </Link>
              </FixedLayout>
            )}
            {status === 'completed' && (
              <FixedLayout
                style={{
                  zIndex: 1,
                  padding: 16,
                  backgroundColor: 'var(--tgui--secondary_bg_color)',
                }}
              >
                <Button
                  size="m"
                  stretched
                  loading={!isLoaded}
                  disabled={isPaymentDisabled}
                  onClick={() => {
                    //@ts-ignore
                    window.Telegram?.WebApp.downloadFile({
                      url: file,
                      file_name: `${orderParam}-${insuranceType}.pdf`,
                    });
                  }}
                >
                  {translate('order:download-file')}
                </Button>
              </FixedLayout>
            )}
          </Section>
        </div>
      </div>
    </>
  );
};
