import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';
import { DailyCombo } from '@football/types';

const INITIAL_COMBO: DailyCombo = {
  analysis_date: '2026-09-11',
  status: 'PUBLISHED',
  number_of_matches: 3,
  total_odds: 3.48,
  theoretical_probability: 0.4285,
  confidence_score: 86,
  risk: 'MODERATE',
  model_version: 'gpt-4o',
  prompt_version: 'v2.4.0',
  algorithm_version: 'v1.0.0',
  selections: [
    {
      match_id: 'bst_1',
      home_team: 'Arsenal',
      away_team: 'Brighton & Hove',
      competition: 'Premier League',
      market: 'OVER_2_5',
      odds: 1.55,
      estimated_probability: 0.76,
      confidence_score: 88,
      selection_order: 1
    },
    {
      match_id: 'bst_2',
      home_team: 'Bayer Leverkusen',
      away_team: 'Eintracht Frankfurt',
      competition: 'Bundesliga',
      market: 'OVER_2_5',
      odds: 1.48,
      estimated_probability: 0.78,
      confidence_score: 89,
      selection_order: 2
    },
    {
      match_id: 'bst_3',
      home_team: 'Villarreal',
      away_team: 'Real Sociedad',
      competition: 'La Liga',
      market: 'BTTS_YES',
      odds: 1.52,
      estimated_probability: 0.72,
      confidence_score: 82,
      selection_order: 3
    }
  ]
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'admin'>('today');
  const [combo, setCombo] = useState<DailyCombo>(INITIAL_COMBO);

  const handleLogin = () => {
    if (passcode.trim() === 'M@jorix90') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Code d\'accès incorrect');
    }
  };

  // Login Gate Screen
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loginCard}>
          <View style={styles.loginLogo}>
            <Text style={styles.loginLogoText}>⚡</Text>
          </View>
          <Text style={styles.loginTitle}>Gnonsky Bet AI</Text>
          <Text style={styles.loginSubtitle}>Entrez votre code d'accès sécurisé pour déverrouiller l'application</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={passcode}
              onChangeText={setPasscode}
              placeholder="Code d'accès..."
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {loginError && <Text style={styles.errorText}>{loginError}</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Déverrouiller</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Gnonsky Bet AI</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>• BetStudy Verified Data</Text>
        </View>

        <TouchableOpacity onPress={() => setIsAuthenticated(false)} style={styles.lockBtn}>
          <Text style={styles.lockBtnText}>Verrouiller</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'today' && (
          <View>
            {/* Meta row */}
            <View style={styles.metaRow}>
              <Text style={styles.dateText}>VENDREDI 11 SEPTEMBRE 2026</Text>
              <View style={styles.sourceTag}>
                <Text style={styles.sourceText}>Source: BetStudy.com</Text>
              </View>
            </View>

            {/* Hero Summary Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>COTE TOTALE DÉTERMINISTE</Text>
                  <Text style={styles.heroOdds}>{combo.total_odds?.toFixed(2)}</Text>
                </View>
                <View style={styles.confidenceBox}>
                  <Text style={styles.heroLabel}>CONFIANCE</Text>
                  <Text style={styles.confidenceVal}>{combo.confidence_score}/100</Text>
                </View>
              </View>

              <View style={styles.metricGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>RISQUE GLOBAL</Text>
                  <Text style={styles.metricValOrange}>{combo.risk}</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>PROBA ESTIMÉE</Text>
                  <Text style={styles.metricVal}>
                    {Math.round((combo.theoretical_probability || 0) * 1000) / 10}%
                  </Text>
                </View>
              </View>

              <Text style={styles.legalNotice}>
                Indépendance événementielle théorique, aucune garantie de gain.
              </Text>
            </View>

            {/* Matches List */}
            <Text style={styles.sectionTitle}>Sélections Algorithmiques ({combo.selections.length}/{combo.selections.length})</Text>

            {combo.selections.map((sel, idx) => (
              <View key={sel.match_id || idx} style={styles.matchCard}>
                <View style={styles.matchCardHeader}>
                  <Text style={styles.competitionText}>{sel.competition}</Text>
                  <Text style={styles.selectionIndexText}>#{idx + 1}</Text>
                </View>

                <View style={styles.matchTeamsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamName}>{sel.home_team}</Text>
                    <Text style={styles.teamNameAway}>{sel.away_team}</Text>
                  </View>
                  <Text style={styles.matchOdds}>{sel.odds.toFixed(2)}</Text>
                </View>

                <View style={styles.matchFooter}>
                  <View style={sel.market === 'OVER_2_5' ? styles.marketTagBlue : styles.marketTagOrange}>
                    <Text style={sel.market === 'OVER_2_5' ? styles.marketTextBlue : styles.marketTextOrange}>
                      {sel.market === 'OVER_2_5' ? 'OVER 2.5 BUTS' : 'BTTS (LES 2 MARQUENT)'}
                    </Text>
                  </View>
                  <Text style={styles.matchProbText}>Prob: {Math.round(sel.estimated_probability * 100)}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.historyContainer}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>BILAN STATISTIQUE AUDITÉ</Text>
              <View style={styles.kpiRow}>
                <View>
                  <Text style={styles.kpiLabel}>Win Rate</Text>
                  <Text style={styles.kpiValue}>74.2%</Text>
                </View>
                <View>
                  <Text style={styles.kpiLabel}>ROI Global</Text>
                  <Text style={styles.kpiValue}>+18.6%</Text>
                </View>
                <View>
                  <Text style={styles.kpiLabel}>Cote Moyenne</Text>
                  <Text style={styles.kpiValue}>2.85</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Dernières Validations</Text>
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>10/09/2026 • 3 sélections</Text>
              <Text style={styles.historyWon}>GAGNÉ (Cote 3.21)</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>09/09/2026 • 0 sélection</Text>
              <Text style={styles.historyNoCombo}>NO_COMBO (Protection Capital)</Text>
            </View>
          </View>
        )}

        {activeTab === 'admin' && (
          <View style={styles.adminContainer}>
            <Text style={styles.sectionTitle}>Pipeline Superviseur BetStudy</Text>
            <View style={styles.heroCard}>
              <Text style={styles.metricLabel}>STATUS MOTEUR IA</Text>
              <Text style={styles.kpiValue}>Opérationnel (gpt-4o)</Text>
              <Text style={styles.legalNotice}>Scraping actif sur les pages publiques BetStudy.com</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('today')}
        >
          <Text style={activeTab === 'today' ? styles.navTextActive : styles.navText}>
            Combiné
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('history')}
        >
          <Text style={activeTab === 'history' ? styles.navTextActive : styles.navText}>
            Historique
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('admin')}
        >
          <Text style={activeTab === 'admin' ? styles.navTextActive : styles.navText}>
            Pipeline
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loginCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  loginLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  loginLogoText: {
    fontSize: 28
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  loginSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12
  },
  textInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F172A'
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600'
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  lockBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9'
  },
  lockBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A'
  },
  versionBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  versionText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '700'
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155'
  },
  sourceTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sourceText: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '600'
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  heroLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2
  },
  heroOdds: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  confidenceBox: {
    alignItems: 'flex-end'
  },
  confidenceVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EA580C'
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600'
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2
  },
  metricValOrange: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EA580C',
    marginTop: 2
  },
  legalNotice: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 6
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  competitionText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  selectionIndexText: {
    fontSize: 10,
    color: '#64748B'
  },
  matchTeamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4
  },
  teamName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A'
  },
  teamNameAway: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569'
  },
  matchOdds: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  marketTagBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  marketTextBlue: {
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: '700'
  },
  marketTagOrange: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  marketTextOrange: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '700'
  },
  matchProbText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  navItem: {
    padding: 10
  },
  navText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
  },
  navTextActive: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '700'
  },
  historyContainer: {
    gap: 10
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 8
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B'
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyDate: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500'
  },
  historyWon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A'
  },
  historyNoCombo: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706'
  },
  adminContainer: {
    gap: 12
  }
});
