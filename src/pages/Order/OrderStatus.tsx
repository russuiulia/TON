import { Title } from '@telegram-apps/telegram-ui';
import { useLanguage } from '../../LanguageProvider';

export const OrderStatus = ({ orderStatus }: any) => {
  let orderStatusTitle;
  const { translate } = useLanguage();

  if (orderStatus === 'draft') {
    orderStatusTitle = translate('title-draft');
  } else if (orderStatus === 'issued') {
    orderStatusTitle = translate('title-issued');
  } else if (orderStatus === 'processing') {
    orderStatusTitle = translate('title-processing');
  } else if (orderStatus === 'paid') {
    orderStatusTitle = translate('title-paid');
  } else if (orderStatus === 'completed') {
    orderStatusTitle = translate('title-completed');
  } else if (orderStatus === 'expired') {
    orderStatusTitle = translate('title-expired');
  } else if (orderStatus === 'failed') {
    orderStatusTitle = translate('title-failed');
  } else if (orderStatus === 'refunded') {
    orderStatusTitle = translate('title-refunded');
  }
  return (
    <Title
      level="2"
      weight="2"
      className="w-full text-center py-4"
      style={{
        paddingBottom: '1rem',
        paddingTop: '1rem',
        textAlign: 'center',
      }}
    >
      {orderStatusTitle}
    </Title>
  );
};
