from flask import Blueprint, request
from app.controllers.riwayatController import RiwayatController


riwayat_bp = Blueprint('riwayat', __name__, url_prefix='/riwayat')
riwayat_controller = RiwayatController()

@riwayat_bp.route('/', methods=['GET'])
def fetch_riwayat():
    return riwayat_controller.get_riwayat()

@riwayat_bp.route('/<int:perhitungan_id>', methods=['GET'])
def fetch_detail_riwayat(perhitungan_id):
    return riwayat_controller.get_detail_riwayat(perhitungan_id)