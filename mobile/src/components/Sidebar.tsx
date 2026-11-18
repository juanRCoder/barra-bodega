import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Box,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  ScanBarcode,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { useAuthUser } from '../hooks/useAuthUser';
import { useLogout } from '../hooks/useLogout';

const COLORS = {
  border: '#E4E9DF',
  danger: '#B5392B',
  green: '#104B37',
  greenSoft: '#D9F36A',
  active: '#EAF2DF',
  ink: '#17221D',
  muted: '#65736B',
  softBg: '#F7F8F2',
  white: '#FFFFFF',
} as const;

type NavEntry = { icon: LucideIcon; label: string; href: string };

const MAIN_NAV: NavEntry[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: UsersRound, label: 'Cuentas', href: '/accounts' },
  { icon: Box, label: 'Inventario', href: '/inventory' },
];

const SHORTCUTS: NavEntry[] = [
  { icon: ScanBarcode, label: 'Nuevo pedido', href: '/scan/new-order' },
];

function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function NavItem({
  icon: Icon,
  label,
  active,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.navItem, active && styles.navItemActive]}
    >
      <Icon
        color={active ? COLORS.green : COLORS.muted}
        size={16}
        strokeWidth={1.8}
      />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const DRAWER_WIDTH = 302;

type SidebarProps = {
  // Ruta activa; hoy solo existe el Dashboard ('/').
  currentPath?: string;
  onNavigate?: (href: string) => void;
};

export function Sidebar({ currentPath = '/', onNavigate }: SidebarProps) {
  const { data: user } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const logout = useLogout();

  const initials = (user?.name ?? '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const open = () => {
    setIsOpen(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const close = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsOpen(false);
    });
  };

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const renderItems = (items: NavEntry[]) =>
    items.map((item) => (
      <NavItem
        key={item.label}
        icon={item.icon}
        label={item.label}
        active={currentPath === item.href}
        onPress={() => {
          close();
          onNavigate?.(item.href);
        }}
      />
    ));

  return (
    <>
      <Pressable
        accessibilityLabel="Abrir menú"
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={open}
        style={styles.menuButton}
      >
        <Menu color={COLORS.ink} size={24} />
      </Pressable>

      <Modal
        animationType="none"
        transparent
        visible={isOpen}
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Animated.View
            pointerEvents="none"
            style={[styles.backdrop, { opacity: progress }]}
          />
          <Pressable
            accessibilityLabel="Cerrar menú"
            onPress={close}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            style={[styles.drawer, { transform: [{ translateX }] }]}
            accessibilityViewIsModal
          >
            <View style={styles.top}>
              <View style={styles.header}>
                <View style={styles.brand}>
                  <View style={styles.logo}>
                    <Text style={styles.logoMark}>▥</Text>
                  </View>
                  <View>
                    <Text style={styles.brandName}>BarraBodega</Text>
                    <Text style={styles.brandSub}>
                      {user?.businessName || 'Mi negocio'}
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityLabel="Cerrar menú"
                  accessibilityRole="button"
                  onPress={close}
                  style={styles.closeButton}
                >
                  <X color={COLORS.ink} size={16} />
                </Pressable>
              </View>

              <View style={styles.nav}>
                <SectionLabel text="MENÚ" />
                {renderItems(MAIN_NAV)}
                <View style={styles.divider} />
                <SectionLabel text="ATAJOS" />
                {renderItems(SHORTCUTS)}
              </View>
            </View>

            <View style={styles.bottom}>
              <View style={styles.divider} />
              <SectionLabel text="SISTEMA" />

              <View style={styles.userRow}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>{initials}</Text>
                </View>
                <View style={styles.userText}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user?.name}
                  </Text>
                  <Text style={styles.userRole} numberOfLines={1}>
                    {user?.businessName || user?.role}
                  </Text>
                </View>
              </View>

              <Pressable style={styles.systemItem}>
                <Phone color={COLORS.muted} size={16} strokeWidth={1.8} />
                <Text style={styles.helpLabel}>Ayuda y soporte</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={logout.isPending}
                onPress={() => logout.mutate(undefined, { onSuccess: close })}
                style={[styles.systemItem, logout.isPending && styles.disabled]}
              >
                <LogOut color={COLORS.danger} size={16} strokeWidth={1.8} />
                <Text style={styles.logoutLabel}>Cerrar sesión</Text>
              </Pressable>
              {logout.error && (
                <Text style={styles.error} accessibilityRole="alert">
                  {logout.error.message}
                </Text>
              )}

              <Text style={styles.version}>BarraBodega v1.0</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  overlay: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    maxWidth: '70%',
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 45,
    paddingBottom: 55,
    gap: 16,
    backgroundColor: COLORS.white,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderCurve: 'continuous',
    boxShadow: '10px 0px 30px rgba(17, 28, 23, 0.25)',
  },
  top: { flex: 1, gap: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
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
    color: COLORS.green,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  brandName: { color: COLORS.ink, fontSize: 14.5, letterSpacing: -0.5 },
  brandSub: { color: COLORS.muted, fontSize: 9.5 },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.softBg,
  },
  nav: { gap: 4 },
  sectionLabel: {
    color: COLORS.muted,
    fontSize: 10.5,
    letterSpacing: 1.4,
    paddingVertical: 8,
  },
  navItem: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  navItemActive: { backgroundColor: COLORS.active },
  navLabel: { color: COLORS.muted, fontSize: 12.5, fontWeight: '500' },
  navLabelActive: { color: COLORS.green, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.border },
  bottom: { gap: 0 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greenSoft,
  },
  userInitials: { color: COLORS.green, fontSize: 11.5 },
  userText: { flex: 1 },
  userName: { color: COLORS.ink, fontSize: 12.5 },
  userRole: { color: COLORS.muted, fontSize: 10.5 },
  systemItem: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  disabled: { opacity: 0.5 },
  helpLabel: { color: COLORS.ink, fontSize: 11.5, fontWeight: '600' },
  logoutLabel: { color: COLORS.danger, fontSize: 11.5, fontWeight: '700' },
  error: { color: COLORS.danger, fontSize: 12, paddingHorizontal: 8 },
  version: { color: COLORS.muted, fontSize: 8, paddingTop: 8 },
});
