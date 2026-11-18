import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { useAuthUser } from '../hooks/useAuthUser';
import { useSalesAnalytics } from '../hooks/useOrders';
import { OrdersApiError } from '../services/orders.service';
import type { SalesPeriod } from '../types/order.type';

const COLORS = {
  background: '#FFFFFF',
  border: '#E4E9DF',
  danger: '#B5392B',
  green: '#176B4D',
  greenDark: '#104B37',
  greenSoft: '#D9F36A',
  avatar: '#EAF2DF',
  ink: '#17221D',
  muted: '#65736B',
  softBg: '#F7F8F2',
} as const;

const RANGES: { value: SalesPeriod; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: '7 días' },
  { value: 'month', label: 'Mes' },
];

const currentDate = new Intl.DateTimeFormat('es-PE', {
  timeZone: 'America/Lima',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

export default function Dashboard() {
  const { data: user } = useAuthUser();
  const [activeRange, setActiveRange] = useState<SalesPeriod>('today');
  const analyticsQuery = useSalesAnalytics(activeRange);
  const analytics = analyticsQuery.data;
  const starProduct = analytics?.topProducts[0];

  const initials = (user?.name ?? '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const pick = <T,>(pending: T, error: T, ok: () => T): T =>
    analyticsQuery.isPending ? pending : analyticsQuery.isError ? error : ok();

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.topBar}>
          <Sidebar />
          <View style={styles.logo}>
            <Text style={styles.logoMark}>▥</Text>
          </View>
          <Text style={styles.brandName}>BarraBodega</Text>
        </View>

        <View style={styles.greeting}>
          <View>
            <Text style={styles.title}>
              {user?.businessName || 'Mi negocio'}
            </Text>
            <Text style={styles.sub}>{currentDate}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </View>

        <View style={styles.range}>
          {RANGES.map((range) => {
            const isActive = activeRange === range.value;
            return (
              <Pressable
                key={range.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => setActiveRange(range.value)}
                style={[styles.rangeButton, isActive && styles.rangeActive]}
              >
                <Text
                  style={[styles.rangeText, isActive && styles.rangeTextActive]}
                >
                  {range.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.card, styles.moneyCard]}>
          <Text style={styles.cardLabelBold}>Dinero recaudado</Text>
          <Text style={styles.money}>
            {pick(
              '…',
              '—',
              () => `S/ ${(analytics?.collectedAmount ?? 0).toFixed(2)}`
            )}
          </Text>
        </View>

        <View style={styles.kpis}>
          <View style={[styles.card, styles.kpi]}>
            <Text style={styles.cardLabel}>Ventas totales</Text>
            <Text style={styles.kpiValue}>
              {pick<string | number>(
                '…',
                '—',
                () => analytics?.ordersCount ?? 0
              )}
            </Text>
          </View>
          <View style={[styles.card, styles.kpi]}>
            <Text style={styles.cardLabel}>Producto estrella</Text>
            <View style={styles.starRow}>
              <Text style={styles.starName}>
                {pick(
                  'Cargando…',
                  '—',
                  () => starProduct?.name ?? 'No hay datos'
                )}
              </Text>
              {starProduct && !analyticsQuery.isError && (
                <View
                  accessibilityLabel={`${starProduct.unitsSold} unidades vendidas`}
                  style={styles.badge}
                >
                  <Text style={styles.badgeText}>{starProduct.unitsSold}</Text>
                </View>
              )}
            </View>
            <Text style={styles.revenue}>
              {pick('Cargando ingresos…', 'No disponible', () =>
                starProduct
                  ? `S/ ${starProduct.salesAmount.toFixed(2)} en ingresos`
                  : 'Sin ingresos en este periodo'
              )}
            </Text>
          </View>
        </View>

        {analyticsQuery.isError && (
          <Text style={styles.error} accessibilityRole="alert">
            {analyticsQuery.error instanceof OrdersApiError
              ? analyticsQuery.error.message
              : 'No se pudieron cargar las ventas.'}
          </Text>
        )}

        <View style={[styles.card, styles.top]}>
          <Text style={styles.topTitle}>Top 3 vendidos</Text>
          {analyticsQuery.isPending ? (
            <Text style={styles.topEmpty}>Cargando ventas…</Text>
          ) : analytics?.topProducts.length ? (
            analytics.topProducts.slice(0, 3).map((product, index) => (
              <View key={product.id} style={styles.topRow}>
                <Text style={styles.topIndex}>{index + 1}.</Text>
                <Text style={styles.topName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.topUnits}>{product.unitsSold} unid.</Text>
              </View>
            ))
          ) : (
            <Text style={styles.topEmpty}>
              {analyticsQuery.isError
                ? 'No se pudieron cargar los datos'
                : 'No hay datos de ventas todavía'}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  content: { width: '100%', maxWidth: 490, marginTop: 40, gap: 12 },
  topBar: { height: 32, flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greenSoft,
  },
  logoMark: {
    color: COLORS.greenDark,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  brandName: { color: COLORS.ink, fontSize: 14.5, letterSpacing: -0.5 },
  greeting: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: COLORS.ink, fontSize: 23, letterSpacing: -1.1 },
  sub: { color: COLORS.muted, fontSize: 10.5 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.avatar,
  },
  initials: { color: COLORS.greenDark, fontSize: 10 },
  range: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  rangeButton: {
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  rangeActive: { backgroundColor: COLORS.green },
  rangeText: { color: COLORS.muted, fontSize: 11 },
  rangeTextActive: { color: '#FFFFFF', fontWeight: '700' },
  card: {
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  moneyCard: { minHeight: 84, padding: 16, justifyContent: 'space-between' },
  cardLabelBold: { color: COLORS.muted, fontSize: 11, fontWeight: '600' },
  cardLabel: { color: COLORS.muted, fontSize: 10.5 },
  money: { color: COLORS.ink, fontSize: 24, letterSpacing: -1.4 },
  kpis: { flexDirection: 'row', gap: 10 },
  kpi: { flex: 1, minHeight: 96, padding: 14, justifyContent: 'space-between' },
  kpiValue: { color: COLORS.ink, fontSize: 32, letterSpacing: -0.8 },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 6,
  },
  starName: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: COLORS.greenSoft,
  },
  badgeText: { color: COLORS.greenDark, fontSize: 11, fontWeight: '600' },
  revenue: { color: COLORS.muted, fontSize: 10, paddingTop: 6 },
  error: { color: COLORS.danger, fontSize: 12 },
  top: { minHeight: 199, padding: 14 },
  topTitle: { color: COLORS.ink, fontSize: 12.5, paddingBottom: 6 },
  topRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  topIndex: { width: 20, color: COLORS.green, fontSize: 10, fontWeight: '700' },
  topName: { flex: 1, color: COLORS.ink, fontSize: 10 },
  topUnits: { color: COLORS.muted, fontSize: 10 },
  topEmpty: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: COLORS.muted,
    fontSize: 11,
  },
});
