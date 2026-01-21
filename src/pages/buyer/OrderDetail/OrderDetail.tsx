import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buyerOrders } from '../../../data/mockData';
import { Package, MapPin, CreditCard, Phone, CheckCircle, Clock, AlertCircle, Truck, Download, RotateCcw, Star, MessageCircle, X, Upload } from 'lucide-react';
import './OrderDetail.css';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const order = buyerOrders.find(o => o.id === id);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);

  // Scroll vers le haut quand la commande change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="not-found">
          <h1>Commande non trouvée</h1>
          <p>La commande que vous recherchez n'existe pas.</p>
          <Link to="/buyer/dashboard" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} color="#10b981" />;
      case 'in_progress':
        return <Truck size={24} color="#3b82f6" />;
      case 'pending':
        return <Clock size={24} color="#f59e0b" />;
      case 'cancelled':
        return <AlertCircle size={24} color="#ef4444" />;
      default:
        return <Package size={24} color="#6b7280" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      in_progress: 'En cours de livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  // Timeline dynamique selon le statut
  const getTimeline = () => {
    const baseTimeline = [
      { status: 'pending', label: 'Commande reçue', date: order.createdAt, completed: true },
    ];

    if (order.status !== 'cancelled') {
      baseTimeline.push(
        { status: 'in_progress', label: 'Préparation', date: new Date(order.createdAt.getTime() + 3600000), completed: order.status !== 'pending' },
        { status: 'in_progress', label: 'En livraison', date: new Date(order.createdAt.getTime() + 7200000), completed: order.status === 'in_progress' || order.status === 'delivered' }
      );
    } else {
      baseTimeline.push(
        { status: 'cancelled', label: 'Commande annulée', date: new Date(order.createdAt.getTime() + 1800000), completed: true }
      );
    }

    if (order.status === 'delivered') {
      baseTimeline.push(
        { status: 'delivered', label: 'Livrée', date: new Date(order.createdAt.getTime() + 10800000), completed: true }
      );
    }

    return baseTimeline;
  };

  const downloadInvoice = () => {
    // Créer le contenu HTML de la facture
    const invoiceContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture ${order.id}</title>
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
          .company-info h1 { color: #059669; font-size: 28px; margin-bottom: 5px; }
          .company-info p { color: #666; font-size: 14px; }
          .invoice-info { text-align: right; }
          .invoice-info p { color: #666; margin: 5px 0; font-size: 14px; }
          .invoice-info strong { display: block; color: #333; margin-top: 10px; }
          .section { margin-bottom: 30px; }
          .section h2 { font-size: 16px; color: #059669; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
          .section-content { color: #333; line-height: 1.8; }
          .customer-info, .delivery-info { display: inline-block; width: 48%; margin-right: 2%; vertical-align: top; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          table th { background: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; color: #333; font-size: 14px; border-bottom: 2px solid #059669; }
          table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
          .product-name { font-weight: 600; color: #333; }
          .text-right { text-align: right; }
          .summary { float: right; width: 300px; margin-top: 20px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
          .summary-row.total { font-size: 18px; font-weight: bold; color: #059669; border-top: 2px solid #059669; padding-top: 10px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px; }
          .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-delivered { background: #d1fae5; color: #065f46; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-in-progress { background: #dbeafe; color: #003d82; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="company-info">
              <h1>JOUR DE MARCHÉ</h1>
              <p>Plateforme de commerce en ligne</p>
            </div>
            <div class="invoice-info">
              <p><strong>Facture</strong></p>
              <p><strong>${order.id}</strong></p>
              <p>Date: ${formatDate(order.createdAt)}</p>
            </div>
          </header>

          <div style="display: flex; margin-bottom: 30px;">
            <div class="customer-info">
              <h3 style="color: #059669; margin-bottom: 10px;">Client</h3>
              <p><strong>${order.customerName || 'Client'}</strong></p>
              <p>${order.shippingAddress || 'Adresse non spécifiée'}</p>
              <p>${order.phone || 'N/A'}</p>
            </div>
            <div class="delivery-info">
              <h3 style="color: #059669; margin-bottom: 10px;">Détails de la commande</h3>
              <p><strong>Boutique:</strong> ${order.shopName}</p>
              <p><strong>Statut:</strong> <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></p>
              <p><strong>Mode de paiement:</strong> ${order.paymentMethod || 'Non spécifié'}</p>
            </div>
          </div>

          <div class="section">
            <h2>Détails des articles</h2>
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th class="text-right">Quantité</th>
                  <th class="text-right">Prix unitaire</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items && order.items.length > 0 
                  ? order.items.map((item: any) => `
                    <tr>
                      <td><span class="product-name">${item.name || 'Produit'}</span></td>
                      <td class="text-right">${item.quantity || 1}</td>
                      <td class="text-right">${formatPrice((item.price || 0))}</td>
                      <td class="text-right">${formatPrice((item.price || 0) * (item.quantity || 1))}</td>
                    </tr>
                  `).join('')
                  : '<tr><td colspan="4" style="text-align: center; color: #999;">Aucun article</td></tr>'
                }
              </tbody>
            </table>
          </div>

          <div class="summary">
            <div class="summary-row">
              <span>Sous-total:</span>
              <span>${formatPrice(order.total * 0.9)}</span>
            </div>
            <div class="summary-row">
              <span>Frais de livraison:</span>
              <span>${formatPrice(order.total * 0.1)}</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL:</span>
              <span>${formatPrice(order.total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Merci d'avoir utilisé Jour de Marché!</p>
            <p>Cette facture a été générée automatiquement le ${formatDate(new Date())}.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Créer un blob et le télécharger
    const blob = new Blob([invoiceContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Facture_${order.id}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div>
          <Link to="/buyer/dashboard" className="breadcrumb-link">← Retour aux commandes</Link>
          <h1>Commande #{order.orderNumber}</h1>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <div className={`order-status-badge status-${order.status}`}>
          {getStatusIcon(order.status)}
          <span>{getStatusLabel(order.status)}</span>
        </div>
      </div>

      <div className="order-detail-grid">
        {/* Timeline - Visible pour toutes les commandes sauf annulées */}
        {order.status !== 'cancelled' && (
          <section className="order-section order-timeline">
            <h2>Suivi de votre commande</h2>
            <div className="timeline">
              {getTimeline().map((item, index) => (
                <div key={index} className={`timeline-item ${item.completed ? 'completed' : ''}`}>
                  <div className="timeline-marker">
                    <div className={`timeline-dot status-${item.status}`}></div>
                    {index < getTimeline().length - 1 && <div className={`timeline-line ${item.completed ? 'completed' : ''}`}></div>}
                  </div>
                  <div className="timeline-content">
                    <h4>{item.label}</h4>
                    <p>{new Intl.DateTimeFormat('fr-FR', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Infos pratiques */}
        <section className="order-section order-info">
          {/* Adresse de livraison - Non visible si annulée */}
          {order.status !== 'cancelled' && (
            <div className="info-block">
              <div className="info-header">
                <MapPin size={20} />
                <h3>Adresse de livraison</h3>
              </div>
              <div className="info-content">
                <p className="address-main">Cocody, Abidjan</p>
                <p className="address-detail">Côte d'Ivoire</p>
              </div>
            </div>
          )}

          {/* Moyen de paiement */}
          <div className="info-block">
            <div className="info-header">
              <CreditCard size={20} />
              <h3>Moyen de paiement</h3>
            </div>
            <div className="info-content">
              <p className="payment-method">Mobile Money - Orange</p>
              <p className={`payment-status ${order.status === 'cancelled' ? 'cancelled' : 'paid'}`}>
                {order.status === 'cancelled' ? '✗ Remboursé' : '✓ Payé'}
              </p>
            </div>
          </div>

          {/* Contact vendeur - Visible sauf si annulée */}
          {order.status !== 'cancelled' && (
            <div className="info-block">
              <div className="info-header">
                <Phone size={20} />
                <h3>Besoin d'aide ?</h3>
              </div>
              <div className="info-content">
                <button className="btn btn-secondary btn-sm">
                  <MessageCircle size={16} />
                  Contacter le vendeur
                </button>
              </div>
            </div>
          )}

          {/* Raison annulation - Visible si annulée */}
          {order.status === 'cancelled' && (
            <div className="info-block cancelled-info">
              <div className="info-header">
                <AlertCircle size={20} color="#ef4444" />
                <h3>Commande annulée</h3>
              </div>
              <div className="info-content">
                <p className="cancellation-reason">Raison : Annulation par le client</p>
                <p className="cancellation-date">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Produits */}
      <section className="order-section order-products">
        <h2>Articles commandés</h2>
        <div className="products-list">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="product-item">
                <div className="product-image">
                  <Package size={32} color="#6b7280" />
                </div>
                <div className="product-info">
                  <h4>{item.name || 'Produit'}</h4>
                  <p className="product-shop">{order.shopName}</p>
                  <p className="product-quantity">Quantité : {item.quantity || 1}</p>
                </div>
                <div className="product-price">
                  {formatPrice((item.price || 0) * (item.quantity || 1))}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-items">Aucun article dans cette commande</p>
          )}
        </div>
      </section>

      {/* Résumé */}
      <section className="order-section order-summary">
        <h2>Résumé de la commande</h2>
        <div className="summary-content">
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{formatPrice(order.total * 0.9)}</span>
          </div>
          <div className="summary-row">
            <span>Frais de livraison</span>
            <span>{formatPrice(order.total * 0.1)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>

      {/* Actions dynamiques selon le statut */}
      <section className="order-section order-actions">
        <div className="actions-grid">
          {/* Actions pour commandes en attente */}
          {order.status === 'pending' && (
            <>
              <div className="action-info">
                <Clock size={20} color="#f59e0b" />
                <div>
                  <p className="action-title">Votre commande est confirmée</p>
                  <p className="action-desc">Elle sera traitée dans les prochaines 24h</p>
                </div>
              </div>
              <button className="btn btn-secondary">
                Annuler la commande
              </button>
              <button className="btn btn-secondary" onClick={downloadInvoice}>
                <Download size={16} />
                Télécharger la facture
              </button>
            </>
          )}

          {/* Actions pour commandes en cours */}
          {order.status === 'in_progress' && (
            <>
              <div className="action-info">
                <Truck size={20} color="#3b82f6" />
                <div>
                  <p className="action-title">Votre commande est en cours de livraison</p>
                  <p className="action-desc">Livraison estimée dans 2-3 jours ouvrables</p>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowContactForm(!showContactForm)}>
                <MessageCircle size={16} />
                Contacter le livreur
              </button>
              <button className="btn btn-secondary" onClick={downloadInvoice}>
                <Download size={16} />
                Télécharger la facture
              </button>
            </>
          )}

          {/* Actions pour commandes livrées */}
          {order.status === 'delivered' && (
            <>
              <div className="action-info success">
                <CheckCircle size={20} color="#10b981" />
                <div>
                  <p className="action-title">Commande livrée avec succès</p>
                  <p className="action-desc">Merci pour votre confiance ! Partagez votre avis pour aider d'autres clients</p>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowReviewForm(!showReviewForm)}>
                <Star size={16} />
                Donner votre avis
              </button>
              <button className="btn btn-secondary" onClick={() => setShowReturnForm(!showReturnForm)}>
                <RotateCcw size={16} />
                Retourner cet article
              </button>
              <button className="btn btn-secondary" onClick={() => setShowContactForm(!showContactForm)}>
                <MessageCircle size={16} />
                Contacter le vendeur
              </button>
              <button className="btn btn-secondary" onClick={downloadInvoice}>
                <Download size={16} />
                Télécharger la facture
              </button>
            </>
          )}

          {/* Actions pour commandes annulées */}
          {order.status === 'cancelled' && (
            <>
              <div className="action-info cancelled">
                <AlertCircle size={20} color="#ef4444" />
                <div>
                  <p className="action-title">Commande annulée</p>
                  <p className="action-desc">Un remboursement a été initié</p>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={downloadInvoice}>
                <Download size={16} />
                Télécharger la facture
              </button>
            </>
          )}

          <Link to="/buyer/dashboard" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>

        {/* Formulaire d'avis - Visible si livré et ouvert */}
        {order.status === 'delivered' && showReviewForm && (
          <div className="review-form-container">
            <div className="review-header">
              <h3>Partagez votre avis</h3>
              <p className="review-subtitle">Votre avis aidera d'autres clients à faire le bon choix</p>
            </div>
            <div className="review-form">
              {/* Produits à évaluer */}
              <div className="review-products">
                <h4>Évaluer les articles</h4>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="review-product-item">
                      <div className="product-name">{item.name || 'Produit'}</div>
                      <div className="form-group">
                        <label>Note sur {item.name}</label>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} className="star-btn" title={`${star} étoile(s)`}>
                              <Star size={24} fill="#fbbf24" color="#fbbf24" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>

              {/* Évaluation globale */}
              <div className="form-group">
                <label>Note globale de la commande</label>
                <div className="star-rating large">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="star-btn" title={`${star} étoile(s)`}>
                      <Star size={32} fill="#fbbf24" color="#fbbf24" />
                    </button>
                  ))}
                </div>
                <p className="star-hint">Cliquez sur une étoile pour donner votre note</p>
              </div>

              {/* Commentaire */}
              <div className="form-group">
                <label>Votre commentaire</label>
                <p className="comment-hint">Décrivez votre expérience d'achat (qualité, livraison, service client...)</p>
                <textarea 
                  placeholder="Partagez les détails de votre expérience avec les autres clients. Soyez honnête et constructif." 
                  rows={5}
                  maxLength={1000}
                ></textarea>
                <p className="char-count">0/1000 caractères</p>
              </div>

              {/* Avis sur la livraison */}
              <div className="form-group">
                <label>Avis sur la livraison</label>
                <div className="delivery-feedback">
                  <button className="feedback-btn" data-feedback="on-time">
                    ✓ À l'heure
                  </button>
                  <button className="feedback-btn" data-feedback="late">
                    ✗ En retard
                  </button>
                  <button className="feedback-btn" data-feedback="fast">
                    ⚡ Plus rapide que prévu
                  </button>
                </div>
              </div>

              {/* Avis sur l'emballage */}
              <div className="form-group">
                <label>État de l'emballage</label>
                <div className="delivery-feedback">
                  <button className="feedback-btn" data-feedback="good">
                    ✓ Très bien
                  </button>
                  <button className="feedback-btn" data-feedback="acceptable">
                    ~ Acceptable
                  </button>
                  <button className="feedback-btn" data-feedback="damaged">
                    ✗ Endommagé
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button className="btn btn-primary">Publier mon avis</button>
                <button className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de contact - Visible si ouvert */}
        {showContactForm && (
          <div className="contact-form-container">
            <div className="modal-header">
              <h3>{order.status === 'delivered' ? 'Contacter le vendeur' : 'Contacter le livreur'}</h3>
              <button className="close-btn" onClick={() => setShowContactForm(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="contact-form">
              {/* Sujets prédéfinis */}
              <div className="form-group">
                <label>Sujet de votre message</label>
                <select className="form-select">
                  <option value="">-- Sélectionnez un sujet --</option>
                  {order.status === 'delivered' ? (
                    <>
                      <option value="product-issue">Produit défectueux ou endommagé</option>
                      <option value="quality">Qualité non conforme</option>
                      <option value="wrong-item">Mauvais produit reçu</option>
                      <option value="missing-item">Article manquant</option>
                      <option value="other">Autre</option>
                    </>
                  ) : (
                    <>
                      <option value="delivery-status">Statut de la livraison</option>
                      <option value="delivery-address">Problème d'adresse</option>
                      <option value="delivery-delay">Retard de livraison</option>
                      <option value="other">Autre</option>
                    </>
                  )}
                </select>
              </div>

              {/* Message */}
              <div className="form-group">
                <label>Votre message</label>
                <textarea 
                  placeholder="Décrivez votre problème ou votre question en détail..." 
                  rows={5}
                  maxLength={500}
                ></textarea>
                <p className="char-count">0/500 caractères</p>
              </div>

              {/* Pièces jointes */}
              {order.status === 'delivered' && (
                <div className="form-group">
                  <label>Pièces jointes (photos, vidéos)</label>
                  <p className="upload-hint">Vous pouvez ajouter des photos pour mieux expliquer votre problème</p>
                  <div className="file-upload-area">
                    <Upload size={32} color="#059669" />
                    <p>Cliquez ou glissez-déposez vos fichiers ici</p>
                    <p className="file-hint">PNG, JPG, MP4 (max 10MB chacun)</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="form-actions">
                <button className="btn btn-primary">Envoyer le message</button>
                <button className="btn btn-secondary" onClick={() => setShowContactForm(false)}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de retour - Visible si ouvert */}
        {showReturnForm && (
          <div className="return-form-container">
            <div className="modal-header">
              <h3>Demander un retour</h3>
              <button className="close-btn" onClick={() => setShowReturnForm(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="return-form">
              {/* Articles à retourner */}
              <div className="form-group">
                <label>Articles à retourner</label>
                {order.items && order.items.length > 0 && (
                  <div className="return-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="return-item">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span>{item.name} x{item.quantity || 1}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Raison du retour */}
              <div className="form-group">
                <label>Raison du retour</label>
                <select className="form-select">
                  <option value="">-- Sélectionnez une raison --</option>
                  <option value="defective">Produit défectueux</option>
                  <option value="damaged">Produit endommagé</option>
                  <option value="not-as-described">Non conforme à la description</option>
                  <option value="wrong-item">Mauvais produit reçu</option>
                  <option value="quality">Qualité insatisfaisante</option>
                  <option value="changed-mind">J'ai changé d'avis</option>
                  <option value="other">Autre raison</option>
                </select>
              </div>

              {/* Détails du problème */}
              <div className="form-group">
                <label>Décrivez le problème</label>
                <textarea 
                  placeholder="Expliquez pourquoi vous souhaitez retourner ce(s) article(s)..." 
                  rows={4}
                  maxLength={500}
                ></textarea>
              </div>

              {/* Photos */}
              <div className="form-group">
                <label>Photos du produit (obligatoire)</label>
                <p className="upload-hint">Joignez des photos claires montrant le défaut ou le problème</p>
                <div className="file-upload-area">
                  <Upload size={32} color="#059669" />
                  <p>Cliquez ou glissez-déposez vos photos ici</p>
                  <p className="file-hint">PNG, JPG (max 10MB chacune)</p>
                </div>
              </div>

              {/* Mode de retour */}
              <div className="form-group">
                <label>Mode de retour souhaité</label>
                <div className="return-mode-options">
                  <button className="option-btn">
                    <div className="option-title">Retrait à domicile</div>
                    <p className="option-desc">Gratuit - Nous venons chercher le colis</p>
                  </button>
                  <button className="option-btn">
                    <div className="option-title">Dépôt en point relais</div>
                    <p className="option-desc">Gratuit - Déposez le colis au point relais</p>
                  </button>
                </div>
              </div>

              {/* Conditions */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Je certifie que le produit est dans son emballage d'origine non ouvert (sauf défaut)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button className="btn btn-primary">Demander un retour</button>
                <button className="btn btn-secondary" onClick={() => setShowReturnForm(false)}>Annuler</button>
              </div>

              {/* Info retour */}
              <div className="return-info">
                <p><strong>Politique de retour :</strong> Les retours sont acceptés sous 30 jours à compter de la livraison. Une fois approuvé, vous avez 7 jours pour retourner l'article.</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
