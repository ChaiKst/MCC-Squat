/**
 * LOGIQUE INTERACTIVE, NAVIGATION MOBILE & TRANSMISSION RÉELLE DE DOSSIER
 * Aucune simulation fictive d'envoi : le formulaire construit un dossier structuré complet,
 * déclenche l'ouverture directe du client de messagerie (mailto RFC 6068) ou l'envoi vers un endpoint
 * configuré, et permet le téléchargement ou la copie immédiate de la fiche de situation.
 */
document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.SITE_CONFIG || {};

  // 1. Injection des données centralisées
  document.querySelectorAll('[data-config="company-name"]').forEach(el => {
    el.textContent = cfg.companyName;
  });
  document.querySelectorAll('[data-config="contact-email"]').forEach(el => {
    el.textContent = cfg.contactEmail;
    if (el.tagName === 'A') {
      el.href = `mailto:${cfg.contactEmail}`;
    }
  });
  document.querySelectorAll('[data-config="service-area"]').forEach(el => {
    el.textContent = cfg.serviceAreaSummary;
  });

  // 2. Navigation mobile accessible
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      mainNav.classList.toggle('is-open');
      navToggle.textContent = isExpanded ? 'Menu' : 'Fermer';
    });
  }

  // 3. Pré-sélection du motif dans le formulaire via paramètre d'URL (?motif=...)
  const urlParams = new URLSearchParams(window.location.search);
  const motifParam = urlParams.get('motif');
  if (motifParam) {
    const selectSituation = document.getElementById('situation-principale');
    if (selectSituation) {
      Array.from(selectSituation.options).forEach(opt => {
        if (opt.value === motifParam) {
          opt.selected = true;
        }
      });
    }
  }

  // 4. Traitement réel du formulaire d'évaluation (sans fausse promesse d'envoi serveur inexistant)
  const form = document.getElementById('diagnostic-form');
  const previewPanel = document.getElementById('dossier-preview-panel');
  const previewText = document.getElementById('dossier-pre-content');
  const mailtoDirectLink = document.getElementById('direct-mailto-trigger');
  const copyDossierBtn = document.getElementById('copy-dossier-btn');
  const downloadDossierBtn = document.getElementById('download-dossier-btn');

  if (form) {
    const buildStructuredDossier = (formData) => {
      const prestations = formData.getAll('prestations');
      const lines = [
        `=============================================================`,
        `DEMANDE D'ÉVALUATION IMMOBILIÈRE — ${cfg.companyFullName || 'MCC Squat'}`,
        `=============================================================`,
        `Date de génération : ${new Date().toLocaleDateString('fr-FR')}`,
        ``,
        `1. IDENTITÉ & QUALITÉ DU DEMANDEUR`,
        `-------------------------------------------------------------`,
        `Nom / Structure     : ${formData.get('nom') || 'Non renseigné'}`,
        `Qualité             : ${formData.get('qualite') || 'Propriétaire'}`,
        `Email               : ${formData.get('email') || 'Non renseigné'}`,
        `Téléphone           : ${formData.get('telephone') || 'Non renseigné'}`,
        `Canal privilégié    : ${formData.get('canal') || 'Téléphone ou Email'}`,
        ``,
        `2. LOCALISATION & TYPOLOGIE DU BIEN`,
        `-------------------------------------------------------------`,
        `Commune / Quartier  : ${formData.get('commune') || 'Toulouse / Haute-Garonne'}`,
        `Type de bien        : ${formData.get('type_bien') || 'Non précisé'}`,
        `Surface approxim.   : ${formData.get('surface') ? formData.get('surface') + ' m²' : 'Non précisée'}`,
        `Accès & annexes     : ${formData.get('acces') || 'Non précisé'}`,
        ``,
        `3. SITUATION ACTUELLE & BESOINS IDENTIFIÉS`,
        `-------------------------------------------------------------`,
        `Situation principale : ${formData.get('situation') || 'Non précisée'}`,
        `Statut juridique     : ${formData.get('statut_occupation') || 'Bien libre de toute occupation'}`,
        `Volets souhaités     : ${prestations.length ? prestations.join(', ') : 'À définir lors du diagnostic'}`,
        `Échéance / Objectif  : ${formData.get('objectif') || 'Non précisé'}`,
        ``,
        `4. DESCRIPTION DÉTAILLÉE DE LA SITUATION`,
        `-------------------------------------------------------------`,
        `${formData.get('description') || 'Aucune précision complémentaire.'}`,
        `=============================================================`
      ];
      return lines.join('\n');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const dossierContent = buildStructuredDossier(formData);
      const subject = `[Évaluation Bien - ${formData.get('commune') || 'Toulouse'}] ${formData.get('situation') || 'Demande d\'intervention'}`;

      // Si un endpoint serveur réel est configuré dans site-config.js, on tente un POST réel
      if (cfg.formEndpointUrl && cfg.formEndpointUrl.startsWith('http')) {
        try {
          const response = await fetch(cfg.formEndpointUrl, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
          });
          if (response.ok) {
            previewText.textContent = dossierContent;
            previewPanel.classList.add('is-visible');
            previewPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
          }
        } catch (err) {
          console.warn('Endpoint distant non joignable, bascule sur transmission directe mailto/dossier.', err);
        }
      }

      // Affichage transparent du dossier structuré + déclenchement réel du client mail
      if (previewText && previewPanel) {
        previewText.textContent = dossierContent;
        previewPanel.classList.add('is-visible');
      }

      const mailtoHref = `mailto:${encodeURIComponent(cfg.contactEmail || 'tps.toulouse31@gmail.com')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(dossierContent)}`;

      if (mailtoDirectLink) {
        mailtoDirectLink.href = mailtoHref;
      }

      // Ouverture réelle du client de messagerie de l'appareil (ordinateur ou téléphone)
      window.location.href = mailtoHref;
      if (previewPanel) {
        previewPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (copyDossierBtn && previewText) {
      copyDossierBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(previewText.textContent);
          const originalText = copyDossierBtn.textContent;
          copyDossierBtn.textContent = 'Récapitulatif copié dans le presse-papiers';
          setTimeout(() => { copyDossierBtn.textContent = originalText; }, 3000);
        } catch (err) {
          alert('Sélectionnez le texte ci-dessus pour le copier.');
        }
      });
    }

    if (downloadDossierBtn && previewText) {
      downloadDossierBtn.addEventListener('click', () => {
        const blob = new Blob([previewText.textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dossier-evaluation-atelier-garona.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }
});
