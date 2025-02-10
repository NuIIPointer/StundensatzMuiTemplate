import { Typography, Stack, Grid, Button, ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StripeContext } from 'context/stripe/index';
import { UserContext } from 'context/user/index';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const PriceCard = ({
  price,
  viewState,
  priceNotice,
  originalPrice,
  stripePriceId,
  bullets,
  feature,
  featured,
  customLink,
  customLinkText
}) => {
  const navigate = useNavigate();
  const [isLoadingCardAction, setIsLoadingCardAction] = useState();
  const { getPortalUrl, createSubscription, activeSubscriptions } = useContext(StripeContext);
  const isActive = activeSubscriptions?.some((sub) => sub.priceId === stripePriceId);

  const onStripeSub = async () => {
    setIsLoadingCardAction(true);
    const checkoutUrl = await createSubscription(stripePriceId);
    window.open(checkoutUrl, '_blank', 'noreferrer');
    setIsLoadingCardAction(false);
  };
  const onPortalClick = async () => {
    setIsLoadingCardAction(true);
    const portalUrl = await getPortalUrl();
    window.open(portalUrl, '_blank', 'noreferrer');
    setIsLoadingCardAction(false);
  };
  const onLoggedOutClick = () => {
    navigate(`/register`);
  };

  const { user } = useContext(UserContext);
  const isLoggedIn = !!user?.uid;
  const theme = useTheme();
  const bulletsRendered = bullets.map((bullet) => (
    <li key={bullet} style={{ marginBottom: 4 }}>
      {bullet}
    </li>
  ));

  const onCardClick = () => {
    if (isLoadingCardAction) return;

    if (customLink) {
      navigate(customLink);
    } else if (!isLoggedIn) {
      onLoggedOutClick();
    } else if (isActive) {
      onPortalClick();
    } else {
      onStripeSub();
    }
  };

  console.log('isLoggedIn', isLoggedIn);

  return (
    <Button
      component={Stack}
      tabIndex={-1}
      color="secondary"
      onClick={onCardClick}
      type="button"
      sx={{
        width: '100%',
        flexDirection: 'column',
        maxWidth: { xs: 500, md: 'none' },
        backgroundColor: isActive ? theme.palette.primary[500] : theme.palette.common.white,
        boxShadow: theme.customShadows.z1,
        padding: theme.shape.paddingBoxMedium,
        borderRadius: theme.shape.borderRadiusBox,
        height: '100%',
        border: featured ? `2px solid ${theme.palette.primary[500]}` : '2px solid transparent',
        color: isActive ? theme.palette.common.white : theme.palette.text.primary,
        textAlign: 'left',
        alignItems: 'stretch',
        transition: '.25s',
        ':hover': {
          borderColor: featured ? theme.palette.primary[500] : theme.palette.grey[500],
          backgroundColor: isActive ? theme.palette.primary[400] : theme.palette.grey[100],
          cursor: 'pointer',
          boxShadow: theme.customShadows.z3
        }
      }}
    >
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" sx={{ fontSize: { xs: 16, lg: 18 } }}>
          {feature} {isActive ? ' (aktiv)' : ''}
        </Typography>
        {featured ? (
          <Stack
            sx={{
              borderRadius: '1000px',
              px: 2,
              py: 0.25,
              backgroundColor: theme.palette.warning.main + '44',
              color: theme.palette.warning.dark,
              my: -2
            }}
          >
            Bestseller
          </Stack>
        ) : (
          ''
        )}
      </Stack>
      <Typography>
        <Typography
          variant="span"
          fontSize={priceNotice && !price ? { xs: 22, md: 24, lg: 36 } : { xs: 26, md: 32, lg: 42 }}
          fontWeight="bold"
          lineHeight="1.15em"
          display="inline-flex"
        >
          {price ? `${price}€` : priceNotice}
        </Typography>
        {!priceNotice && (
          <Typography variant="span" sx={{ opacity: 0.7 }}>
            /{viewState === 'monthly' ? 'Monat' : viewState === 'halfYearly' ? 'Halbjahr' : 'Jahr'}
          </Typography>
        )}
      </Typography>
      {originalPrice && (
        <Typography variant="span" sx={{ opacity: 0.7, display: 'flex', gap: 1 }} aria-hidden>
          <Stack
            sx={{
              textDecoration: 'line-through'
            }}
          >
            {originalPrice}€
          </Stack>
          spare {Math.round(((originalPrice - price) / originalPrice) * 100)}%
        </Typography>
      )}
      <Stack sx={{ mb: { xs: 2, md: 2.5, lg: 3 } }}>
        <ul style={{ paddingLeft: theme.spacing(2) }}>{bulletsRendered}</ul>
      </Stack>
      <Button
        variant={featured ? 'contained' : 'outlined'}
        color={isActive ? 'white' : undefined}
        sx={{ mt: 'auto' }}
        tabIndex={-1}
        role="presentation"
      >
        {customLinkText || (isActive ? 'Abo verwalten' : 'Jetzt starten')}{' '}
        {isLoadingCardAction ? (
          <CircularProgress color="inherit" stroke="currentColor" size={20} sx={{ marginLeft: theme.spacing(1) }} />
        ) : (
          ''
        )}
      </Button>
    </Button>
  );
};

const PricesCards = ({ pricesConfig = pricesConfigPreset, containerProps }) => {
  const theme = useTheme();
  const [viewState, setViewState] = useState('monthly');
  const handleViewChange = (_event, newViewState) => {
    if (newViewState !== null) {
      setViewState(newViewState);
    }
  };

  return (
    <Grid container columnSpacing={{ xs: 2, sm: 3, md: 4 }} rowSpacing={{ xs: 2, sm: 3, md: 4 }} {...containerProps}>
      <Grid item xs={12}>
        <Stack sx={{ display: 'flex', alignItems: { xs: 'start', sm: 'center' }, marginBottom: 2 }}>
          {/* <Box sx={{ backgroundColor: theme.palette.common.white }}> */}
          <ToggleButtonGroup
            value={viewState}
            exclusive
            onChange={handleViewChange}
            color="primary"
            sx={{
              padding: 1.5,
              backgroundColor: theme.palette.common.white,
              boxShadow: theme.customShadows.z1,
              borderRadius: theme.shape.borderRadiusBox,
              justifyContent: 'center',
              '.MuiButtonBase-root.MuiToggleButtonGroup-grouped.MuiToggleButton-root': {
                border: `1px solid ${theme.palette.grey[300]}`
              }
            }}
          >
            <ToggleButton value="monthly">Monatlich</ToggleButton>
            <ToggleButton value="halfYearly">Halbjährlich</ToggleButton>
            <ToggleButton value="yearly">Jährlich</ToggleButton>
          </ToggleButtonGroup>
          {/* </Box> */}
        </Stack>
      </Grid>
      {pricesConfig.map((priceConfig) => (
        <Grid key={priceConfig.title} item xs={12} sm={6} lg={4}>
          <PriceCard
            key={priceConfig.prices?.[viewState].stripePriceId || priceConfig.priceNotice}
            feature={priceConfig.title}
            viewState={viewState}
            price={priceConfig.prices?.[viewState].price}
            originalPrice={
              priceConfig.prices &&
              (viewState === 'halfYearly'
                ? priceConfig.prices?.monthly.price * 6
                : viewState === 'yearly'
                ? priceConfig.prices?.monthly.price * 12
                : null)
            }
            priceNotice={priceConfig.priceNotice}
            stripePriceId={priceConfig.prices?.[viewState].stripePriceId}
            bullets={priceConfig.bullets}
            featured={priceConfig.featured}
            customLink={priceConfig.customLink}
            customLinkText={priceConfig.customLinkText}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const pricesConfigPreset = [
  {
    title: 'Pro',
    prices: {
      monthly: { price: 69, stripePriceId: 'price_1QUSccFGa3DH0yAqeNCcleFW' },
      halfYearly: { price: 360, stripePriceId: 'price_1QNB4UFGa3DH0yAqgxE3OQ0B' },
      yearly: { price: 620, stripePriceId: 'price_1QNB5JFGa3DH0yAqcJCNddLm' }
    },
    featured: true,
    bullets: ['Mitarbeiterkostenplanung', 'Produktmargenplanung', 'Erfassung des Plangewinns', 'Kundensupport']
  },
  {
    title: 'Premium',
    prices: {
      monthly: { price: 299, stripePriceId: 'price_1QUSazFGa3DH0yAqzUU4v4U9' },
      halfYearly: { price: 1520, stripePriceId: 'price_1QUSazFGa3DH0yAqPZk0IBrb' },
      yearly: { price: 2690, stripePriceId: 'price_1QUSazFGa3DH0yAq85zvOhaH' }
    },
    bullets: [
      'Monatliches Beratungsgespräch',
      'Exklusive Vorlagen & Checklisten',
      'Regelmäßige Schulungen und Webinare',
      'Alle Funktionen des Pro Plan',
      'Priorisierter Kundensupport'
    ]
  },
  {
    title: 'Enterprise',
    priceNotice: 'Preis auf Anfrage',
    customLink: '/kontakt',
    customLinkText: 'Jetzt anfragen',
    bullets: [
      'Unbegrenzte Stundensatzkalkulation',
      'Durchführung der Kalkulation in ihrem Betrieb',
      'Individuelle Handlungsempfehlungen',
      'Für Unternehmens- und Steuerberater',
      'Alle Features des Premiumplan',
      'Persönlicher Accountmanager'
    ]
  }
];

export default PricesCards;
