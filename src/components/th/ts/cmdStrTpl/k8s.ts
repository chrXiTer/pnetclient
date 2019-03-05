let k8s = {
reset:`
kubeadm reset -f;
rm -r $HOME/.kube;
rm -r /var/etcd/calico-data;
ip link delete flannel.1;
ip link delete cni0
`,
cfgK8sCmd:`
echo 'KUBELET_EXTRA_ARGS="--max-pods=100000 --cadvisor-port=4194"' > /etc/default/kubelet;
systemctl daemon-reload;
systemctl restart kubelet
`.trim(),
masterInit:`
kubeadm init --kubernetes-version=v1.11.3 --token-ttl 0 
    --pod-network-cidr 10.190.224.0/19 
    --service-cidr 10.190.96.0/19
`.trim(),
chgDnsAddr:`
sed -i 's/10.96.0.10/10.190.96.10/g' /var/lib/kubelet/config.yaml
`.trim()
}

export default k8s
